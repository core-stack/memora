import { env } from '@/env';
import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { LLMService } from '@/infra/llm/llm.service';
import { PromptService } from '@/infra/prompt/prompt.service';
import { ChatMemoryService } from '@/modules/memory/chat-memory/chat-memory.service';
import { Message } from '@memora/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';

import { KnowledgeService } from '../../knowledge.service';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService extends TenantService<Message> {
  constructor(
    protected readonly repository: MessageRepository,
    private readonly llmService: LLMService,
    private readonly knowledgeService: KnowledgeService,
    private readonly chatMemoryService: ChatMemoryService,
    private readonly promptService: PromptService
  ) {
    super(repository);
  }

  async sendMessage(content: string, ctx: HttpContext): Promise<{
    userMessage: Message;
    aiMessage: Message;
  }> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    const chatId = ctx.params.getString("chatId");
    if (!chatId) {
      throw new BadRequestException("Chat id is required");
    }
    //#region add user message to memory and database
    const userMessage = await this.repository.create({
      content,
      chatId,
      messageRole: "USER",
      tenantId: env.TENANT_ID,
      knowledgeId
    });
    await this.chatMemoryService.add(userMessage);
    //#endregion

    //#region improve query and get relevant fragments to answer
    const prompt = this.promptService.getTemplate("ImproveQuery").build({ query: content });
    const improvedQuery = await this.llmService.query(prompt);
    const { lastNMessages, searchQuery } = await this.chatMemoryService.search(
      chatId, 
      ChatMemoryService.withSearchQuery(improvedQuery),
      ChatMemoryService.withLastNMessages(10),
    );
    

    //#region add ai message to memory and database
    const llmResponse = await this.llmService.query(improvedQuery);
    const aiMessage = await this.repository.create({
      content: llmResponse,
      chatId: ctx.params.getString("chatId"),
      messageRole: "AI",
      tenantId: env.TENANT_ID,
      knowledgeId
    });
    await this.chatMemoryService.add(aiMessage);
    //#endregion

    return { userMessage, aiMessage };
  }
}
