import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { VerificationTokenService } from './verification-token.service';

@Module({
  providers: [VerificationTokenService],
  imports: [DatabaseModule],
  exports: [VerificationTokenService],
})
export class VerificationTokenModule {}
