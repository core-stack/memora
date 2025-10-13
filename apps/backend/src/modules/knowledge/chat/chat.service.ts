import z from 'zod';

import { env } from '@/env';
import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { LLMService } from '@/infra/llm/llm.service';
import { Prompt, prompts } from '@/infra/llm/prompts';
import { Chat, CreateChatWithInitialMessage } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService extends TenantService<Chat> {
  constructor(
    protected readonly repository: ChatRepository,
    private readonly llmService: LLMService,
    private readonly knowledgeService: KnowledgeService,
  ) {
    super(repository);
  }

  async createWithMessage({ initialMessage }: CreateChatWithInitialMessage, ctx: HttpContext) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));

    const prompt = await prompts[Prompt.GENERATE_CHAT_NAME].format({ query: initialMessage });
    const res = await this.llmService.withStructuredOutput(prompt, z.object({ name: z.string() }));

    return await this.repository.createWithInitialMessage({
      name: res.name,
      tenantId: env.TENANT_ID,
      knowledgeId
    }, initialMessage);
  }
}
