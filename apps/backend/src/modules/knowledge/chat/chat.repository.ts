import { chat, message } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Chat } from '@memora/schemas';

export class ChatRepository extends DrizzleGenericRepository<typeof chat, Chat> {
  constructor() {
    super(chat);
  }

  async createWithInitialMessage(
    { knowledgeId, name, tenantId }: Omit<Chat, "id" | "createdAt" | "updatedAt">,
    initialMessage: string
  ): Promise<Chat> {
    return this.db.transaction(async (tx) => {
      const res = await tx.insert(chat).values({ knowledgeId, name, tenantId }).returning();
      await tx.insert(message).values({
        chatId: res[0].id,
        knowledgeId,
        tenantId,
        messageRole: "USER",
        content: initialMessage
      });
      return res[0]; 
    });
  }
}