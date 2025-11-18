import {
  Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TenantId } from '../shared/decorators/context';
import { ChatEntity } from './chat.entity';
import { FolderEntity } from './folder.entity';
import { KnowledgeLLMEntity } from './knowledge-llm.entity';
import { MessageEntity } from './message.entity';
import { SourceEntity } from './source.entity';

export enum KnowledgeStatus {
  DELETING = 'DELETING',
  DELETE_ERROR = 'DELETE_ERROR',
  OK = 'OK',
}

@Entity('knowledge')
@Index('knowledge_tenant_idx', ['tenantId'])
@Unique('knowledge_tenant_slug_unique', ['tenantId', 'slug'])
export class KnowledgeEntity {
  @ApiProperty({ description: 'The unique identifier of the knowledge base', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The URL-friendly slug for the knowledge base', example: 'my-knowledge-base' })
  @Column({ length: 255 })
  slug: string;

  @ApiProperty({ description: 'The title of the knowledge base', example: 'My Knowledge Base' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ description: 'A brief description of the knowledge base', example: 'This knowledge base contains documents about our products.', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'The status of the knowledge base', enum: KnowledgeStatus, example: KnowledgeStatus.OK })
  @Column({ type: 'enum', enum: KnowledgeStatus, default: KnowledgeStatus.OK })
  status: KnowledgeStatus;

  @ApiProperty({ description: 'The error message if deletion fails', example: 'Could not delete all associated files.', required: false })
  @Column({ name: 'delete_error', type: 'text', nullable: true })
  deleteError?: string;

  @ApiProperty({ description: 'The number of files in the knowledge base', example: 10 })
  @Column({ name: 'file_count', type: 'integer', default: 0 })
  files: number;

  @ApiProperty({ description: 'The total storage used by the knowledge base in bytes', example: 1048576 })
  // note: depending on your driver you may want a transformer to convert string->number
  @Column({ name: 'storage', type: 'bigint', default: 0 })
  storage: string | number;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this knowledge base belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @ApiProperty({ description: 'The timestamp when the knowledge base was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the knowledge base was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @ApiProperty({ type: () => FolderEntity, isArray: true })
  @OneToMany(() => FolderEntity, (f) => f.knowledge)
  folders: FolderEntity[];

  @ApiProperty({ type: () => SourceEntity, isArray: true })
  @OneToMany(() => SourceEntity, (s) => s.knowledge)
  sources: SourceEntity[];

  @ApiProperty({ type: () => ChatEntity, isArray: true })
  @OneToMany(() => ChatEntity, (c) => c.knowledge)
  chats: ChatEntity[];

  @ApiProperty({ type: () => MessageEntity, isArray: true })
  @OneToMany(() => MessageEntity, (c) => c.knowledge)
  messages: MessageEntity[];

  @ApiProperty({ type: () => KnowledgeLLMEntity, isArray: true })
  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs: KnowledgeLLMEntity[];
}
