import z from 'zod';

import { BaseFragment, Fragments } from '@/fragment';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Inject } from '@nestjs/common';

export type QueryOptions<T extends BaseFragment> = {
  knowledgeInstructions?: string;
  fragments?: Fragments<T>[];
}

export type WithQueryOptions<T extends BaseFragment> = (currentOpts: QueryOptions<T>) => QueryOptions<T>;

export class LLMService {
  constructor(@Inject(BaseChatModel) private readonly llm: BaseChatModel) {}

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

  async withStructuredOutput<S extends z.ZodObject<any>>(query: string, schema: S): Promise<z.infer<S>> {
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