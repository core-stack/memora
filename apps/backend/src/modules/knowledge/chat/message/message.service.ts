import { env } from '@/env';
import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { LLMService } from '@/infra/llm/llm.service';
import { Message } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../../knowledge.service';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService extends TenantService<Message> {
  constructor(
    protected readonly repository: MessageRepository,
    private readonly llmService: LLMService,
    private readonly knowledgeService: KnowledgeService,
  ) {
    super(repository);
  }

  async sendMessage(input: string, ctx: HttpContext): Promise<{
    userMessage: Message;
    aiMessage: Message;
  }> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    const userMessage = await this.repository.create({
      content: input,
      chatId: ctx.params.getString("chatId"),
      messageRole: "USER",
      tenantId: env.TENANT_ID,
      knowledgeId
    });
    const res = await this.llmService.query(input);
    const aiMessage = await this.repository.create({
      content: res,
      chatId: ctx.params.getString("chatId"),
      messageRole: "AI",
      tenantId: env.TENANT_ID,
      knowledgeId
    });
    return { userMessage, aiMessage };
  }
}
