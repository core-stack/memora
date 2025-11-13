import { CreatedBy, TenantId } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KnowledgeLLMEntity } from './knowledge-llm.entity';

import { KnowledgeStatus } from '@/shared/enums';
import { FolderEntity } from './folder/folder.entity';
import { SourceEntity } from './source/source.entity';
import { ChatEntity } from './chat/chat.entity';
import { MessageEntity } from './chat/message/message.entity';

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

  @Column({ type: 'text', nullable: true })
  instructions?: string;

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

  @OneToMany(() => KnowledgeLLMEntity, (k) => k.knowledge)
  llms: KnowledgeLLMEntity[];
}
