import { DatabaseModule } from '@/infra/database/database.module';
import { SecurityModule } from '@/infra/security/security.module';
import { Module } from '@nestjs/common';

import { LLMController } from './llm.controller';
import { LLMService } from './llm.service';

@Module({
  controllers: [LLMController],
  providers: [LLMService],
  imports: [DatabaseModule, SecurityModule],
  exports: [LLMService]
})
export class LLMModule {}
