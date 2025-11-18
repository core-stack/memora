import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ChatEntity } from './chat.entity';
import { KnowledgeEntity } from './knowledge.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

@Entity('messages')
export class MessageEntity {
  @ApiProperty({ description: 'The unique identifier of the message', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The role of the message sender', enum: MessageRole, example: MessageRole.USER })
  @Column({ name: 'message_role', type: 'enum', enum: MessageRole })
  messageRole: MessageRole;

  @ApiProperty({ description: 'The content of the message', example: 'Hello, world!' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'The ID of the chat this message belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'chat_id', type: 'uuid' })
  chatId: string;

  @ApiProperty({ type: () => ChatEntity })
  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat?: ChatEntity;

  @ApiProperty({ description: 'The ID of the knowledge base associated with this message', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ApiProperty({ type: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge?: KnowledgeEntity;

  @ApiProperty({ description: 'The ID of the tenant this message belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ApiProperty({ description: 'The timestamp when the message was created' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the message was last updated' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(message: Partial<MessageEntity>) {
    Object.assign(this, message);
  }
}
