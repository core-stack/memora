import z from 'zod';

import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Plugin } from '@memora/schemas';
import { Inject } from '@nestjs/common';

import { decidePluginsToUsePrompt } from './prompts/decide-plugin-to-use';
import { improveQueryPrompt } from './prompts/improve-query';

export class LLMService {
  constructor(@Inject(BaseChatModel) private llm: BaseChatModel) {}

  async improveQuery(query: string, knowledgeBaseDescription: string): Promise<string> {
    const { text } = await this.llm.invoke(await improveQueryPrompt.format({ knowledgeBaseDescription, query }));
    return text;
  }

  async decidePluginsToUse(query: string, knowledgeBaseDescription: string, plugins: Plugin[]): Promise<Plugin[]> {
    const prompt = await decidePluginsToUsePrompt.format({ knowledgeBaseDescription, plugins, query });
    const idSchema = z.array(z.string().uuid())
    const structuredLLM = this.llm.withStructuredOutput<z.infer<typeof idSchema>>(idSchema);
    const ids = await structuredLLM.invoke(prompt);
    return plugins.filter(p => ids.includes(p.id));
  }

  async withStructuredOutput<T extends Record<string, any> = Record<string, any>>(query: string, schema: z.ZodType): Promise<T> {
    const structuredLLM = this.llm.withStructuredOutput<T>(schema);
    return structuredLLM.invoke(query);
  }
}