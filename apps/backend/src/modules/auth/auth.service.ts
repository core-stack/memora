import { CreateAccountSchema } from "@snipet/schemas";
import { UserRepository } from "../user/user.repository";
import { BadRequestException } from "@nestjs/common";
import { SecurityService } from "@/infra/security/security.service";
import { TxManagerService } from "@/generics/tx-manager";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: SecurityService,
    private readonly txManager: TxManagerService
  ){}

  async createAccount(data: CreateAccountSchema) {
    // verify if user exists by email
    const userWithEmail = await this.userRepository.find({ filter: { email: data.email } });
    if (userWithEmail.length > 0) throw new BadRequestException("Email already in use");

    const hashedPassword = await this.securityService.hash(data.password);

    data.password = hashedPassword;
    this.txManager.run(async (tx) => {
      await this.userRepository.create(data, { tx });

    })
  }
}