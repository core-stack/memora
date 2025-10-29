import { eq, sql } from 'drizzle-orm';

import { chat, message } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Chat } from '@snipet/schemas';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { ChatEntity, CreateChatEntity, UpdateChatEntity } from './chat.entity';

export class ChatRepository extends DrizzleGenericRepository<
  typeof chat, ChatEntity, CreateChatEntity, UpdateChatEntity
> {
  constructor() {
    super(chat);
  }

  async findWithCountMessages(
    chatId: string,
    repoOpts?: RepositoryOptions<TxType>
  ): Promise<(Chat & { messageCount: number }) | undefined> {
    return this.run(async (db) => {
      const result = await db.select({
          id: chat.id,
          name: chat.name,
          knowledgeId: chat.knowledgeId,
          tenantId: chat.tenantId,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          messageCount: sql<number>`COUNT(${message.id})`.mapWith(Number).as('messageCount'),
        })
        .from(chat)
        .leftJoin(message, eq(chat.id, message.chatId))
        .where(eq(chat.id, chatId))
        .groupBy(chat.id)
        .limit(1);

      return result[0];

    }, repoOpts);
  }
}