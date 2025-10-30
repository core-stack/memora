import { CreateAccountSchema } from "@snipet/schemas";
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

@Injectable()
export class AuthService {
  constructor(
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

  async activeAccount(token: string, opts?: ServiceOptions) {
    const verificationTokenList = await this.verificationTokenService.find({
      filter: { token, type: "ACTIVE_ACCOUNT" }
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

  async forgetPassword(email: string, opts?: ServiceOptions) {
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
}