import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { KnowledgeEntity } from './knowledge.entity';
import { MessageEntity } from './message.entity';

@Entity('chats')
export class ChatEntity {
  @ApiProperty({ description: 'The unique identifier of the chat', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the chat', example: 'My Chat' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: 'The ID of the associated knowledge base', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', readOnly: true })
  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ApiProperty({ type: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: KnowledgeEntity;

  @ApiProperty({ type: () => MessageEntity, isArray: true })
  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @ApiProperty({ description: 'The ID of the tenant this chat belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', readOnly: true })
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ApiProperty({ description: 'The timestamp when the chat was created', readOnly: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the chat was last updated', readOnly: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(data: Partial<ChatEntity>) {
    Object.assign(this, data);
  }
}
