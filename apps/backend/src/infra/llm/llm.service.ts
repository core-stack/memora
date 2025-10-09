import z from 'zod';

import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Plugin } from '@memora/schemas';
import { Inject } from '@nestjs/common';

import { improveQueryPrompt } from './prompts/improve-query';
import { Prompt, prompts } from './prompts';

export class LLMService {
  constructor(@Inject(BaseChatModel) private llm: BaseChatModel) {}

  async improveQuery(query: string, knowledgeInstructions?: string): Promise<string> {
    const { text } = await this.llm.invoke(await improveQueryPrompt.format({ knowledgeInstructions, query }));
    return text;
  }

  async decidePluginsToUse(query: string, knowledgeBaseDescription?: string, plugins: Plugin[] = []): Promise<Plugin[]> {
    const prompt = await prompts[Prompt.DECIDE_PLUGINS_TO_USE].format({ knowledgeBaseDescription, plugins, query });
    const idSchema = z.array(z.string().uuid())
    const structuredLLM = this.llm.withStructuredOutput<z.infer<typeof idSchema>>(idSchema);
    const ids = await structuredLLM.invoke(prompt);
    return plugins.filter(p => ids.includes(p.id));
  }

  async withStructuredOutput<S extends z.ZodTypeAny>(query: string, schema: S): Promise<z.infer<S>> {
    const structuredLLM = this.llm.withStructuredOutput<z.infer<S>>(schema);
    return (await structuredLLM.invoke(query));
  }
}