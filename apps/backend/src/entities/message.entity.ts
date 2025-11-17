import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { ChatEntity } from './chat.entity';
import { KnowledgeEntity } from './knowledge.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'message_role', type: 'enum', enum: MessageRole })
  messageRole: MessageRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'chat_id', type: 'uuid' })
  chatId: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat?: ChatEntity;

  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge?: KnowledgeEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(message: Partial<MessageEntity>) {
    Object.assign(this, message);
  }
}
