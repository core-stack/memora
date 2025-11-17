import {
  Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';

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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: KnowledgeStatus, default: KnowledgeStatus.OK })
  status: KnowledgeStatus;

  @Column({ name: 'delete_error', type: 'text', nullable: true })
  deleteError?: string;

  @Column({ name: 'file_count', type: 'integer', default: 0 })
  files: number;

  // note: depending on your driver you may want a transformer to convert string->number
  @Column({ name: 'storage', type: 'bigint', default: 0 })
  storage: string | number;

  @TenantId()
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @OneToMany(() => FolderEntity, (f) => f.knowledge)
  folders: FolderEntity[];

  @OneToMany(() => SourceEntity, (s) => s.knowledge)
  sources: SourceEntity[];

  @OneToMany(() => ChatEntity, (c) => c.knowledge)
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, (c) => c.knowledge)
  messages: MessageEntity[];

  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs: KnowledgeLLMEntity[];
}
