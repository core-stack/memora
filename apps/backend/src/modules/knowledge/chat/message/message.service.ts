import { chat } from '@/db/schema';
import { env } from '@/env';
import { HttpContext } from '@/generics/http-context';
import { LLMService } from '@/infra/llm/llm.service';
import { PromptService } from '@/infra/prompt/prompt.service';
import { ChatMemoryService } from '@/modules/memory/chat-memory/chat-memory.service';
import { SourceMemoryService } from '@/modules/memory/source-memory/source-memory.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessage, Message, UpdateMessage } from '@snipet/schemas';

import { KnowledgeService } from '../../knowledge.service';
import { ChatService } from '../chat.service';
import { MessageRepository } from './message.repository';
import { CreateMessageEntity, MessageEntity, UpdateMessageEntity } from './message.entity';
import { CrudService } from '@/generics';
import { ServiceOptions } from '@/generics/service.interface';

@Injectable()
export class MessageService extends CrudService<
  Message, CreateMessage, UpdateMessage,
  MessageEntity, CreateMessageEntity, UpdateMessageEntity
> {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    protected readonly repository: MessageRepository,
    private readonly llmService: LLMService,
    private readonly knowledgeService: KnowledgeService,
    private readonly chatMemoryService: ChatMemoryService,
    private readonly sourceMemoryService: SourceMemoryService,
    private readonly promptService: PromptService,
    private readonly chatService: ChatService
  ) {
    super(repository);
  }

  async sendMessage(content: string, opts?: ServiceOptions): Promise<{ userMessage: Message; aiMessage: Message; }> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(opts?.http);

    //#region get chat
    const chatId = opts?.http?.params.getString("chatId");
    if (!chatId) throw new NotFoundException("Chat id is required");

    const chat = await this.chatService.findWithCountMessages(chatId, opts);
    if (!chat) throw new NotFoundException("Chat not found");

    // if no have messages, is a new chat, then create chat name
    if (chat.messageCount === 0) {
      this.logger.verbose("Chat is empty, creating chat name");
      const chatNamePrompt = this.promptService.getTemplate("GenerateChatName").build({ query: content });
      await this.chatService.update(
        chatId,
        { name: await this.llmService.query(chatNamePrompt) },
        opts
      );
    }
    //#endregion

    //#region add user message to memory and database
    const userMessage = await this.repository.create({
      content,
      chatId,
      messageRole: "USER",
      tenantId: env.TENANT_ID,
      knowledgeId
    }, { tx: opts?.tx });
    await this.chatMemoryService.add(userMessage);
    //#endregion

    //#region get relevant fragments to answer
    const chatSearchResult = await this.chatMemoryService.search(
      knowledgeId,
      chatId,
      ChatMemoryService.withSearchQuery(content),
    );
    const sourceSearchResult = await this.sourceMemoryService.find(
      knowledgeId,
      content
    )
    //#endregion


    //#region build prompt to get answer
    const answerPrompt = this.promptService.getTemplate("AnwserQuestion").build({
      question: content,
      recentMessages: [], // lastNMessages.map(f => ({ role: f.role, content: f.content })),
      relevantMessages: chatSearchResult.searchQuery.map(f => ({ content: f.content, role: f.role })),
      retrievedFragments: sourceSearchResult.map(f => f.content),
    });
    //#endregion


    //#region generate, add ai message to memory and database
    const llmResponse = await this.llmService.query(answerPrompt);
    const aiMessage = await this.repository.create({
      content: llmResponse,
      chatId,
      messageRole: "AI",
      tenantId: env.TENANT_ID,
      knowledgeId
    }, { tx: opts?.tx });
    await this.chatMemoryService.add(aiMessage);
    //#endregion

    return { userMessage, aiMessage };
  }
}
