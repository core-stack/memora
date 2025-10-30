import { LLMModule } from '@/modules/llm/llm.module';
import { Module } from '@nestjs/common';

import { LLMLoaderService } from './llm-loader.service';
import { LLMManagerService } from './llm-manager.service';

@Module({
  imports: [LLMModule],
  providers: [LLMManagerService, LLMLoaderService],
  exports: [LLMManagerService]
})
export class LLMManagerModule {}