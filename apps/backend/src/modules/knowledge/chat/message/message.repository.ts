import { message } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateMessageEntity, MessageEntity, UpdateMessageEntity } from './message.entity';
import { desc, eq } from 'drizzle-orm';
import { TxType } from '@/infra/database/types';
import { RepositoryOptions } from '@/generics/repository.interface';

export class MessageRepository extends DrizzleGenericRepository<
  typeof message, MessageEntity, CreateMessageEntity, UpdateMessageEntity
> {
  constructor() {
    super(message);
  }

  async findLastNMessages(
    chatId: string,
    lastNMessages: number,
    opts?: RepositoryOptions<TxType>
  ): Promise<MessageEntity[]> {
    return this.run(async (db) => {
      return db.select()
        .from(message)
        .where(eq(message.chatId, chatId))
        .limit(lastNMessages)
        .orderBy(desc(message.createdAt));
    }, opts);
  }
}