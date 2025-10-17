import { env } from '@/env';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Module } from '@nestjs/common';

import { PromptModule } from '../prompt/prompt.module';
import { LLMService } from './llm.service';

@Module({
  imports: [
    PromptModule
  ],
  providers: [
    {
      provide: BaseChatModel,
      useFactory: () => new ChatGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL }),
    },
    LLMService
  ],
  exports: [ BaseChatModel, LLMService ]
})
export class LLMModule {}
