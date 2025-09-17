import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export class LLMService {
  constructor(private llm: BaseChatModel) {}
}