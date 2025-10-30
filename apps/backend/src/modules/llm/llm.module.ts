import { DatabaseModule } from '@/infra/database/database.module';
import { SecurityModule } from '@/infra/security/security.module';
import { Module } from '@nestjs/common';

import { LLMController } from './llm.controller';
import { LLMRepository } from './llm.repository';
import { LLMService } from './llm.service';

@Module({
  controllers: [LLMController],
  providers: [LLMService, LLMRepository],
  imports: [DatabaseModule, SecurityModule],
  exports: [LLMRepository, LLMService]
})
export class LLMModule {}
