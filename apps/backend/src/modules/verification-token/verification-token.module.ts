import { DatabaseModule } from '@/infra/database/database.module';
import { HTTPContextModule } from '@/shared/http-context/http-context.module';
import { Module } from '@nestjs/common';

import { VerificationTokenService } from './verification-token.service';

@Module({
  providers: [VerificationTokenService],
  imports: [DatabaseModule, HTTPContextModule],
  exports: [VerificationTokenService],
})
export class VerificationTokenModule {}
