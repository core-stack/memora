
import { EntityManager } from 'typeorm';

import { MessageEntity, MessageRole } from '@/entities/message.entity';
import { PromptService } from '@/infra/prompt/prompt.service';
import { LLMService } from '@/modules/llm/llm.service';
import { ChatMemoryService } from '@/modules/memory/chat-memory/chat-memory.service';
import { SourceMemoryService } from '@/modules/memory/source-memory/source-memory.service';
import { Service } from '@/shared/service';
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { KnowledgeService } from '../../knowledge.service';
import { ChatService } from '../chat.service';

@Injectable()
export class MessageService extends Service<MessageEntity> {
  logger = new Logger(MessageService.name);
  entity = MessageEntity;

  @Inject() private readonly llmService: LLMService;
  @Inject() private readonly knowledgeService: KnowledgeService;
  @Inject(forwardRef(() => ChatMemoryService)) private readonly chatMemoryService: ChatMemoryService;
  @Inject() private readonly sourceMemoryService: SourceMemoryService;
  @Inject() private readonly promptService: PromptService;
  @Inject() private readonly chatService: ChatService;

  async sendMessage(
    content: string,
    manager?: EntityManager
  ): Promise<{ userMessage: MessageEntity; aiMessage: MessageEntity; }> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();

    //#region get chat
    const chatId = this.context.params.shouldGetString("chatId");
    const chat = await this.chatService.findWithCountMessages(chatId, manager);
    if (!chat) throw new NotFoundException("Chat not found");

    // if no have messages, is a new chat, then create chat name
    const instance = await this.llmService.getInstanceByKnowledge(knowledgeId, "TEXT", manager);
    if (!instance) throw new NotFoundException("LLM not found");
  
    if (chat.messageCount === 0) {
      this.logger.verbose("Chat is empty, creating chat name");
      const chatNamePrompt = this.promptService.getTemplate("GenerateChatName").build({ query: content });
      await this.chatService.update(
        chatId,
        { name: (await instance.generate({ prompt: chatNamePrompt })).output },
        manager
      );
    }
    //#endregion

    //#region add user message to memory and database
    const userMessage = await super.create(new MessageEntity({
      content,
      chatId,
      messageRole: MessageRole.USER,
      knowledgeId,
    }), manager);

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
      content,
    )
    //#endregion

    //#region build prompt to get answer
    const answerPrompt = this.promptService.getTemplate("AnwserQuestion").build({
      question: content,
      recentMessages: [], // lastNMessages.map(f => ({ role: f.role, content: f.content })),
      relevantMessages: chatSearchResult.searchQuery.map(f => ({ content: f.content, role: f.role })),
      retrievedFragments: sourceSearchResult
        .map(f => (`${f.content} {sourceId:${f.sourceId}, seqId:${f.seqId}}`)),
    });
    //#endregion

    //#region generate, add ai message to memory and database
    const llmResponse = await instance.generate({ prompt: answerPrompt });
    const aiMessage = await super.create(new MessageEntity({
      content: llmResponse.output,
      chatId,
      messageRole: MessageRole.ASSISTANT,
      knowledgeId
    }), manager);
    await this.chatMemoryService.add(aiMessage);
    //#endregion

    return { userMessage, aiMessage };
  }

  async findLastNMessages(chatId: string, lastNMessages: number, manager?: EntityManager) {
    return await this.repository(manager).find({
      where: { chatId },
      order: { createdAt: "DESC" },
      take: lastNMessages
    });
  }
}
