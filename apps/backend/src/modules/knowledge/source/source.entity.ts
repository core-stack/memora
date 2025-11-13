import { TenantId, FromParams } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KnowledgeEntity } from '../knowledge.entity';
import { FolderEntity } from '../folder/folder.entity';
import { IndexStatus, SourceType } from '@/shared/enums';
import { TenantEntity } from '@/modules/tenant/tenant.entity';

@Entity('sources')
@Index('sources_memory_idx', ['memoryId'])
@Index('sources_key_idx', ['key'])
@Index('sources_index_status_idx', ['indexStatus'])
export class SourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'text' })
  path: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'original_name', length: 255, nullable: true })
  originalName?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
  })
  sourceType: SourceType;

  @Column({
    name: 'index_status',
    type: 'enum',
    enum: IndexStatus,
  })
  indexStatus: IndexStatus;

  @Column({ name: 'index_error', type: 'text', nullable: true })
  indexError?: string;

  @Column({ name: 'memory_id', length: 36, nullable: true })
  memoryId?: string;

  @FromParams('knowledgeId')
  @Column({ name: 'knowledge_id', length: 36 })
  knowledgeId: string;

  @TenantId()
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ name: 'folder_id', length: 36, nullable: true })
  folderId?: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.sources, { onDelete: 'CASCADE' })
  knowledge: KnowledgeEntity;

  @ManyToOne(() => FolderEntity, (folder) => folder.sources, { onDelete: 'CASCADE', nullable: true })
  folder?: FolderEntity;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.sources, { onDelete: 'CASCADE' })
  tenant: TenantEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
