import { message } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateMessageEntity, MessageEntity, UpdateMessageEntity } from './message.entity';

export class MessageRepository extends DrizzleGenericRepository<
  typeof message, MessageEntity, CreateMessageEntity, UpdateMessageEntity
> {
  constructor() {
    super(message);
  }
}