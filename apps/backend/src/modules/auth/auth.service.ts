import { CreateAccountSchema } from "@snipet/schemas";
import { UserRepository } from "../user/user.repository";
import { BadRequestException } from "@nestjs/common";
import { SecurityService } from "@/infra/security/security.service";
import { TxManager } from "@/generics/tx-manager";
import { VerificationTokenService } from "../verification-token/verification-token.service";
import { env } from "@/env";
import moment from "moment";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly securityService: SecurityService,
    private readonly txManager: TxManager
  ){}

  async createAccount(data: CreateAccountSchema) {
    // verify if user exists by email
    const userWithEmail = await this.userRepository.find({ filter: { email: data.email } });
    if (userWithEmail.length > 0) throw new BadRequestException("Email already in use");

    const hashedPassword = await this.securityService.hash(data.password);

    data.password = hashedPassword;
    this.txManager.run(async (tx) => {
      const user = await this.userRepository.create({
        ...data,
        roleId: "",
        emailVerified: env.REQUIRE_EMAIL_VERIFICATION ? undefined : new Date(),
      }, { tx });

      if (env.REQUIRE_EMAIL_VERIFICATION) {
        const verificationToken = await this.verificationTokenService.create({
          userId: user.id,
          type: "ACTIVE_ACCOUNT",
          expires: moment().add(env.ACTIVE_ACCOUNT_TOKEN_EXPIRES_IN, "second").toDate()
        });
      }
    });
  }
}