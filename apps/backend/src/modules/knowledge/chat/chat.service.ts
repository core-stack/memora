import { TenantService } from '@/generics/tenant.service';
import { Chat, CreateChatWithInitialMessage } from '@memora/schemas';
import { Inject, Injectable } from '@nestjs/common';

import { ChatRepository } from './chat.repository';
import { LLMService } from '@/infra/llm/llm.service';
import { Prompt, prompts } from '@/infra/llm/prompts';
import z from 'zod';
import { env } from '@/env';
import { HttpContext } from '@/generics/http-context';
import { KnowledgeService } from '../knowledge.service';
import { MessageService } from './message/message.service';

@Injectable()
export class ChatService extends TenantService<Chat> {

  constructor(
    protected readonly repository: ChatRepository,
    private readonly llmService: LLMService,
    private readonly knowledgeService: KnowledgeService,
    private readonly messageService: MessageService
  ) {
    super(repository);
  }

  async createWithMessage({ initialMessage }: CreateChatWithInitialMessage, ctx: HttpContext) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));

    const prompt = await prompts[Prompt.GENERATE_CHAT_NAME].format({ query: initialMessage });
    const res = await this.llmService.withStructuredOutput(prompt, z.object({ name: z.string() }));

    const createdChat = await this.repository.create({
      name: res.name,
      tenantId: env.TENANT_ID,
      knowledgeId
    });
    await this.messageService.create({
      chatId: createdChat.id,
      knowledgeId,
      tenantId: env.TENANT_ID,
      messageRole: 'USER',
      content: initialMessage,
    }, ctx);
    return createdChat;
  }
}
