import { EntityManager } from 'typeorm';

import { Service } from '@/shared/service';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ChatEntity } from '../../../entities/chat.entity';
import { KnowledgeService } from '../knowledge.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService extends Service<ChatEntity> {
  logger = new Logger(ChatService.name);
  entity = ChatEntity;

  @Inject() private readonly knowledgeService: KnowledgeService;

  override async create(data: CreateChatDto, manager?: EntityManager): Promise<ChatEntity> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    const chat = new ChatEntity({
      name: data.name ?? "New Chat",
      knowledgeId
    })
    return super.create(chat, manager);
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
