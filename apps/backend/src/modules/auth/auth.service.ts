import { Queue } from 'bullmq';
import moment from 'moment';
import { EntityManager } from 'typeorm';

import { RoleScope } from '@/entities/role.entity';
import { env } from '@/env';
import { EmailPayload, EmailTemplate } from '@/jobs/email/schemas';
import { JobType } from '@/jobs/types';
import { GenericService } from '@/shared/generic-service';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ROLES } from '@snipet/permission';

import { UserEntity } from '../../entities/user.entity';
import {
  VerificationTokenEntity, VerificationType
} from '../../entities/verification-token.entity';
import { RoleService } from '../role/role.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { VerificationTokenService } from '../verification-token/verification-token.service';
import { AuthManager } from './auth-manager.service';
import { ActiveAccountDto } from './dto/active-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GetOAuth2UrlResponseDto } from './dto/get-oauth2-url.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService extends GenericService {
  logger = new Logger(AuthService.name);

  @Inject() private readonly authManager: AuthManager;
  @Inject() private readonly userService: UserService;
  @Inject() private readonly roleService: RoleService;
  @Inject() private readonly tenantService: TenantService;
  @Inject() private readonly verificationTokenService: VerificationTokenService;
  @InjectQueue(JobType.SEND_EMAIL) private readonly sendMail: Queue<EmailPayload>;

  getActiveProviders(): string[] {
    return this.authManager.activeProviders();
  }

  private async createVerificationToken(
    userId: string,
    type: VerificationType,
    manager?: EntityManager
  ): Promise<VerificationTokenEntity> {
    let expires: Date;
    switch (type) {
      case "RESET_PASSWORD":
        expires = moment().add(env.RESET_PASSWORD_TOKEN_EXPIRES_IN, "second").toDate();
        break;
      case "ACTIVE_ACCOUNT":
        expires = moment().add(env.ACTIVE_ACCOUNT_TOKEN_EXPIRES_IN, "second").toDate();
        break;
      default:
        throw new BadRequestException("Invalid verification token type");
    }

    return await this.verificationTokenService.create(
      new VerificationTokenEntity({ userId, type, expires }),
      manager
    );
  }

  private async sendActivationAccountEmail(
    email: string,
    name: string | undefined,
    token: string
  ): Promise<void> {
    await this.sendMail.add("", {
      to: email,
      subject: "Active your account",
      template: EmailTemplate.ACTIVE_ACCOUNT,
      context: {
        name: name,
        activationUrl: `${env.FRONTEND_URL}/auth/activate/${token}`
      }
    });
  }

  async createAccount(data: CreateAccountDto, manager?: EntityManager): Promise<void> {
    // verify if user exists by email
    const userWithEmail = await this.userService.find({ where: { email: data.email } }, manager);
    if (userWithEmail.length > 0) throw new BadRequestException("Email already in use");

    let user = new UserEntity({
      name: data.name,
      email: data.email,
      emailVerified: env.REQUIRE_EMAIL_VERIFICATION ? undefined : new Date()
    });
    await user.setPassword(data.password);

    this.transaction(async (manager) => {
      const role = await this.roleService.findUnique({
        where: { key: ROLES.global.user.key, scope: RoleScope.GLOBAL }
      }, manager);
      if (!role) throw new NotFoundException("Role not found");
      user.roleId = role.id;

      user = await this.userService.create(user, manager);

      await this.tenantService.create({
        name: `${user.name}'s Org`,
        backgroundImage: ""
      }, manager);

      if (env.REQUIRE_EMAIL_VERIFICATION) {
        const verificationToken = await this.createVerificationToken(
          user.id,
          VerificationType.ACTIVE_ACCOUNT,
          manager
        );
        await this.sendActivationAccountEmail(data.email, data.name, verificationToken.token);
      }
    }, manager);
  }

  async activeAccount(data: ActiveAccountDto, manager?: EntityManager): Promise<void> {
    const verificationToken = await this.verificationTokenService.findFirst({
      where: { token: data.token, type: VerificationType.ACTIVE_ACCOUNT }
    }, manager);

    if (!verificationToken) {
      throw new BadRequestException("Activation link invalid");
    }

    const user = await this.userService.findByID(verificationToken.userId, { manager });
    if (!user) throw new BadRequestException("User not found");

    if (moment().isAfter(verificationToken.expires)) {
      return this.transaction(async (manager) => {
        await this.verificationTokenService.delete(verificationToken.token, manager);
        await this.userService.update(
          user.id,
          user.verifyEmail(false),
          manager
        );

        const newToken = await this.createVerificationToken(
          user.id,
          VerificationType.ACTIVE_ACCOUNT,
          manager
        );
        await this.sendActivationAccountEmail(user.email, user.name, newToken.token);
        throw new BadRequestException("Activation link expired, a new link has been sent to your email");
      }, manager);
    }
    return this.transaction(async (manager) => {
      await this.verificationTokenService.delete(verificationToken.token, manager);
      await this.userService.update(user.id, user.verifyEmail(), manager);
    }, manager);
  }

  async forgetPassword(data: ForgetPasswordDto, manager?: EntityManager): Promise<void> {
    const { email } = data;
    const user = await this.userService.findUnique({ where: { email } }, manager);
    if (!user) throw new NotFoundException("User not found");

    await this.transaction(async (manager) => {
      const token = await this.createVerificationToken(
        user.id,
        VerificationType.RESET_PASSWORD,
        manager
      );
      await this.sendMail.add("", {
        to: email,
        subject: "Reset your password",
        template: EmailTemplate.FORGET_PASSWORD,
        context: {
          name: user.name,
          resetUrl: `${env.FRONTEND_URL}/auth/reset-password/${token}`
        }
      });
    });
  }

  async login(data: LoginDto, manager?: EntityManager): Promise<LoginResponseDto> {
    const user = await this.userService.findFirstWithMemberRoleTenant(
      { where: { email: data.email } },
      manager
    );

    if (!user) throw new NotFoundException("Email or password invalid");
    if (!user.password) throw new NotFoundException("Email or password invalid");

    const valid = await user.comparePassword(data.password);
    if (!valid) throw new NotFoundException("Email or password invalid");

    const { token } = await this.authManager.createSessionAndTokens(user);

    this.context.setCookie("access-token", token.accessToken, {
      maxAge: token.accessTokenDuration,
      httpOnly: true,
      path: "/"
    });
    this.context.setCookie("refresh-token", token.refreshToken, {
      maxAge: token.refreshTokenDuration,
      httpOnly: true,
      path: "/"
    });

    return new LoginResponseDto({ redirect: data.redirect ?? "/" });
  }

  async logout(): Promise<void> {
    this.context.deleteCookies([ "access-token", "refresh-token" ]);
  }

  async resetPassword(data: ResetPasswordDto, manager?: EntityManager): Promise<void> {
    await this.transaction(async (manager) => {
      const verificationToken = await this.verificationTokenService.findFirst({
        where: { token: data.token, type: VerificationType.RESET_PASSWORD },
        relations: [ "user" ]
      }, manager);
      if (!verificationToken) throw new BadRequestException("Reset password link invalid");
      if (!verificationToken.user) throw new NotFoundException("User not found");
      const user = verificationToken.user;
      await this.userService.update(
        user.id,
        await user.setPassword(data.password),
        manager
      );
      await this.verificationTokenService.delete(data.token, manager);
    }, manager);
  }

  async getOAuth2Url(provider: string): Promise<GetOAuth2UrlResponseDto> {
    if (!this.authManager.hasProvider(provider)) throw new NotFoundException("Provider not found");
    return new GetOAuth2UrlResponseDto({ url: await this.authManager.oauth2GetUrl(provider) });
  }

  async oauth2Callback(provider: string, code: string): Promise<LoginResponseDto> {
    if (!this.authManager.hasProvider(provider)) throw new NotFoundException("Provider not found");
    return this.transaction(async (manager) => {      
      const { token, user } = await this.authManager.oauth2Callback(provider, code, manager);
      const existingTenant = await this.tenantService.find({ where: { members: { userId: user.id } } });
      if (existingTenant.length === 0) {
        await this.tenantService.create({
          name: `${user.name}'s Org`,
          backgroundImage: "",
          userId: user.id
        }, manager);
      }
      
      this.context.setCookie("access-token", token.accessToken, {
        maxAge: token.accessTokenDuration,
        httpOnly: true,
        path: "/"
      });
      this.context.setCookie("refresh-token", token.refreshToken, {
        maxAge: token.refreshTokenDuration,
        httpOnly: true,
        path: "/"
      });
  
      return new LoginResponseDto({ redirect: "/" });
    })
  }
}
