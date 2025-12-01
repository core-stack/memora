import { EntityManager } from "typeorm";

import { Service } from "@/shared/service";
import { Injectable, Logger } from "@nestjs/common";

import { ChatEntity } from "../../../entities/chat.entity";
import { CreateChatDto } from "./dto/create-chat.dto";

@Injectable()
export class ChatService extends Service<ChatEntity> {
  logger = new Logger(ChatService.name);
  entity = ChatEntity;

  override async create(data: CreateChatDto, manager?: EntityManager): Promise<ChatEntity> {
    const chat = new ChatEntity({
      name: data.name ?? "New Chat",
      knowledgeId: data.knowledgeId,
      tenantId: data.tenantId
    });
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
