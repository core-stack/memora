import z from 'zod';

import { BaseFragment, Fragments } from '@/fragment';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

import { PromptService } from '../prompt/prompt.service';

export type QueryOptions<T extends BaseFragment> = {
  knowledgeInstructions?: string;
  fragments?: Fragments<T>[];
}

export type WithQueryOptions<T extends BaseFragment> = (currentOpts: QueryOptions<T>) => QueryOptions<T>;

export class LLMService {
  constructor(
    private readonly llm: BaseChatModel,
    private readonly promptService: PromptService,
  ) {}

  // async improveQuery(query: string, knowledgeInstructions?: string): Promise<string> {
  //   const { text } = await this.llm.invoke(
  //     this.promptService.getTemplate("ImproveQuery").build({ knowledgeInstructions, query })
  //   );
  //   return text;
  // }

  // async decidePluginsToUse(query: string, knowledgeInstructions?: string, plugins: Plugin[] = []): Promise<Plugin[]> {
  //   const idSchema = z.array(z.string().uuid()).describe("Plugin ids");
  //   const structuredLLM = this.llm.withStructuredOutput<z.infer<typeof idSchema>>(idSchema);
  //   const ids = await structuredLLM.invoke(
  //     this.promptService.getTemplate("DecidePluginsToUse").build({ plugins, query, knowledgeInstructions })
  //   );
  //   return plugins.filter(p => ids.includes(p.id));
  // }

  async query(query: string): Promise<any> {
    const res = await this.llm.generate([[{ content: query, role: "user" }]]);
    return res.generations[0][0].text;
  }

  async *stream(query: string): AsyncIterable<string> {
    const stream = await this.llm.stream(query);
    for await (const chunk of stream) {
      yield chunk.text;
    }
  }

  async withStructuredOutput<S extends z.ZodTypeAny>(query: string, schema: S): Promise<z.infer<S>> {
    const structuredLLM = this.llm.withStructuredOutput<z.infer<S>>(schema);
    return (await structuredLLM.invoke(query));
  }

  static withKnowledgeInstructions<T extends BaseFragment>(instructions: string): WithQueryOptions<T> {
    return (opts: Partial<QueryOptions<T>>) => {
      return { ...opts, knowledgeInstructions: instructions };
    }
  }

  static withFragments<T extends BaseFragment>(fragments: Fragments<T>[]): WithQueryOptions<T> {
    return (opts: Partial<QueryOptions<T>>) => {
      return { ...opts, fragments };
    }
  }

  protected buildQueryOptions(...opts: WithQueryOptions<BaseFragment>[]): QueryOptions<BaseFragment> {
    let queryOpts: QueryOptions<BaseFragment> = {};
    for (const opt of opts) {
      queryOpts = { ...queryOpts, ...opt(queryOpts) };
    }
    return queryOpts;
  }
}