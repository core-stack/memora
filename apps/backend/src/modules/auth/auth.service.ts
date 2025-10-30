import { ActiveAccountSchema, CreateAccountSchema, ForgetPasswordSchema, LoginSchema, ResetPasswordSchema } from "@snipet/schemas";
import { UserRepository } from "../user/user.repository";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SecurityService } from "@/infra/security/security.service";
import { TxManager } from "@/generics/tx-manager";
import { VerificationTokenService } from "../verification-token/verification-token.service";
import { env } from "@/env";
import moment from "moment";
import { UserService } from "../user/user.service";
import { ServiceOptions } from "@/generics/service.interface";
import { InjectQueue } from "@nestjs/bullmq";
import { JobType } from "@/jobs/types";
import { Queue } from "bullmq";
import { EmailPayload, EmailTemplate } from "@/jobs/email/schemas";
import { VerificationTokenEntity, VerificationTokenType } from "../verification-token/verification-token.entity";
import { AuthManager } from "./auth-manager.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly authManager: AuthManager,
    private readonly userService: UserService,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly securityService: SecurityService,
    private readonly txManager: TxManager,
    @InjectQueue(JobType.SEND_EMAIL) private readonly sendMail: Queue<EmailPayload>,
  ) {}

  private async createVerificationToken(
    userId: string,
    type: VerificationTokenType,
    opts?: ServiceOptions
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

    return await this.verificationTokenService.create({
      userId,
      type,
      expires
    }, opts);
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
        activationUrl: `${env.FRONTEND_URL}/auth/activate/${token}`,
      }
    });
  }

  async createAccount(data: CreateAccountSchema, opts?: ServiceOptions) {
    // verify if user exists by email
    const userWithEmail = await this.userService.find({ filter: { email: data.email } });
    if (userWithEmail.length > 0) throw new BadRequestException("Email already in use");

    data.password = await this.securityService.hash(data.password);
    this.txManager.runOrCreate(opts?.tx, async (tx) => {
      const user = await this.userService.create({
        ...data,
        roleId: "",
        emailVerified: env.REQUIRE_EMAIL_VERIFICATION ? undefined : new Date(),
      }, { tx });

      if (env.REQUIRE_EMAIL_VERIFICATION) {
        const verificationToken = await this.createVerificationToken(
          user.id,
          "ACTIVE_ACCOUNT",
          { ...opts, tx }
        );
        await this.sendActivationAccountEmail(data.email, data.name, verificationToken.token);
      }
    });
  }

  async activeAccount(data: ActiveAccountSchema, opts?: ServiceOptions) {
    const verificationTokenList = await this.verificationTokenService.find({
      filter: { token: data.token, type: "ACTIVE_ACCOUNT" }
    });

    if (!verificationTokenList || verificationTokenList.length === 0) {
      throw new BadRequestException("Activation link invalid");
    }

    const verificationToken = verificationTokenList[0];

    const user = await this.userService.findByID(verificationToken.userId, { tx: opts?.tx });
    if (!user) throw new BadRequestException("User not found");

    if (moment().isAfter(verificationToken.expires)) {
      return this.txManager.runOrCreate(opts?.tx, async (tx) => {
        await this.verificationTokenService.delete(verificationToken.token, { tx });
        await this.userService.update(verificationToken.userId, { emailVerified: undefined }, { tx });

        const newToken = await this.createVerificationToken(
          user.id,
          "ACTIVE_ACCOUNT",
          { ...opts, tx }
        );
        await this.sendActivationAccountEmail(user.email, user.name, newToken.token);
        throw new BadRequestException("Activation link expired, a new link has been sent to your email");
      });
    }
    return this.txManager.runOrCreate(opts?.tx, async (tx) => {
      await this.verificationTokenService.delete(verificationToken.token, { tx });
      await this.userService.update(verificationToken.userId, { emailVerified: new Date() }, { tx });
    })
  }

  async forgetPassword(data: ForgetPasswordSchema, opts?: ServiceOptions) {
    const { email } = data;
    const user = await this.userService.findUnique({ filter: { email } }, { tx: opts?.tx });
    if (!user) throw new NotFoundException("User not found");

    await this.txManager.runOrCreate(opts?.tx, async (tx) => {
      const token = await this.createVerificationToken(user.id, "RESET_PASSWORD", { ...opts, tx })
      await this.sendMail.add("", {
        to: email,
        subject: "Reset your password",
        template: EmailTemplate.FORGET_PASSWORD,
        context: {
          name: user.name,
          resetUrl: `${env.FRONTEND_URL}/auth/reset-password/${token}`,
        }
      });
    });
  }

  async login(data: LoginSchema, opts?: ServiceOptions) {
    if (!opts?.http) throw new Error("http context is required");

    const user = await this.userService.findFirstWithMemberRoleTenant(
      { filter: { email: data.email } },
      { tx: opts?.tx }
    );

    if (!user) throw new NotFoundException("Email or password invalid");
    if (!user.password) throw new NotFoundException("Email or password invalid");
    const valid = await this.securityService.compareHash(data.password, user.password);
    if (!valid) throw new NotFoundException("Email or password invalid");

    const { token } = await this.authManager.createSessionAndTokens(user);

    opts.http.setCookie("access-token", token.accessToken, {
      maxAge: token.accessTokenDuration,
      httpOnly: true,
      path: "/",
    });
    opts.http.setCookie("refresh-token", token.refreshToken, {
      maxAge: token.refreshTokenDuration,
      httpOnly: true,
      path: "/",
    });

    return { redirect: data.redirect ?? "/" }
  }

  async logout(opts?: ServiceOptions) {
    if (!opts?.http) throw new Error("http context is required");
    opts.http.deleteCookies(["access-token", "refresh-token"]);
  }

  async resetPassword(data: ResetPasswordSchema, opts?: ServiceOptions) {
    await this.txManager.runOrCreate(opts?.tx, async (tx) => {
      const verificationToken = await this.verificationTokenService.findUniqueWithUser({
        filter: { token: data.token, type: "RESET_PASSWORD" }
      }, { ...opts, tx });
      if (!verificationToken) throw new BadRequestException("Reset password link invalid");
      if (!verificationToken.user) throw new BadRequestException("User not found");

      await this.userService.update(
        verificationToken.user.id,
        { password: await this.securityService.hash(data.password) },
        { ...opts, tx }
      );
      await this.verificationTokenService.delete(data.token, { ...opts, tx });
    })

  }
}