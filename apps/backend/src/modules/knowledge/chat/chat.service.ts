import { Inject, Injectable, Logger } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { ChatEntity } from './chat.entity';
import { Service } from '@/shared/service';
import { EntityManager } from 'typeorm';

@Injectable()
export class ChatService extends Service<ChatEntity> {
  logger = new Logger(ChatService.name);
  entity = ChatEntity;

  @Inject() private readonly knowledgeService: KnowledgeService;

  override async create(data: ChatEntity, manager?: EntityManager): Promise<ChatEntity> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    data.knowledgeId = knowledgeId;
    if (!data.name) data.name = "New Chat";
    return super.create(data, manager);
  }

  async findWithCountMessages(
    chatId: string,
    manager?: EntityManager
  ): Promise<(ChatEntity & { messageCount: number }) | null> {
    const chat = await this.repository(manager)
      .createQueryBuilder("chat")
      .loadRelationCountAndMap("chat.messageCount", "chat.messages")
      .where("chat.id = :id", { id: chatId })
      .getOne();

    return chat as (ChatEntity & { messageCount: number }) | null;
  }
}
