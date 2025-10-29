import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { VerificationTokenRepository } from "./verification-token.repository";
import { VerificationTokenService } from "./verification-token.service";

@Module({
  providers: [VerificationTokenService, VerificationTokenRepository],
  imports: [DatabaseModule],
  exports: [VerificationTokenService, VerificationTokenRepository],
})
export class VerificationTokenModule {}
