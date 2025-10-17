import { eq, sql } from 'drizzle-orm';

import { chat, message } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Chat } from '@snipet/schemas';

export class ChatRepository extends DrizzleGenericRepository<typeof chat, Chat> {
  constructor() {
    super(chat);
  }
  
  async findWithCountMessages(chatId: string): Promise<(Chat & { messageCount: number }) | undefined> {
    const result = await this.db
      .select({
        id: chat.id,
        name: chat.name,
        knowledgeId: chat.knowledgeId,
        tenantId: chat.tenantId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: sql<number>`COUNT(${message.id})`.as('messageCount'),
      })
      .from(chat)
      .leftJoin(message, eq(chat.id, message.chatId))
      .where(eq(chat.id, chatId))
      .groupBy(chat.id)
      .limit(1);

    return result[0];
  }
}