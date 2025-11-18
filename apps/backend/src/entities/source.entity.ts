import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { FromParams, TenantId } from '../shared/decorators/context';
import { FolderEntity } from './folder.entity';
import { KnowledgeEntity } from './knowledge.entity';
import { TenantEntity } from './tenant.entity';

import { SourceType } from './metadata.types';
import type { SourceMetadata } from './metadata.types';

export enum IndexStatus {
  PENDING = 'PENDING',
  INDEXING = 'INDEXING',
  INDEXED = 'INDEXED',
  ERROR = 'ERROR',
}

@Entity('sources')
@Index('sources_memory_idx', ['memoryId'])
@Index('sources_key_idx', ['key'])
@Index('sources_index_status_idx', ['indexStatus'])
export class SourceEntity {
  @ApiProperty({ description: 'The unique identifier of the source', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The key of the source file in the storage', example: 'documents/mydoc.pdf' })
  @Column({ type: 'text' })
  key: string;

  @ApiProperty({ description: 'The path of the source file', example: '/documents/mydoc.pdf' })
  @Column({ type: 'text' })
  path: string;

  @ApiProperty({ description: 'The name of the source', example: 'mydoc.pdf' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'A brief description of the source', example: 'This document contains the project specifications.', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'The original name of the file', example: 'My Document.pdf', required: false })
  @Column({ name: 'original_name', length: 255, nullable: true })
  originalName?: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @Column({ type: 'jsonb' })
  metadata: SourceMetadata;

  @ApiProperty({ description: 'The type of the source', enum: SourceType, example: SourceType.DOC })
  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
  })
  sourceType: SourceType;

  @ApiProperty({ description: 'The indexing status of the source', enum: IndexStatus, example: IndexStatus.INDEXED })
  @Column({
    name: 'index_status',
    type: 'enum',
    enum: IndexStatus,
  })
  indexStatus: IndexStatus;

  @ApiProperty({ description: 'The error message if indexing fails', example: 'Could not extract text from the document.', required: false })
  @Column({ name: 'index_error', type: 'text', nullable: true })
  indexError?: string;

  @ApiProperty({ description: 'The ID of the memory associated with this source', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'memory_id', length: 36, nullable: true })
  memoryId?: string;

  @FromParams('knowledgeId')
  @ApiProperty({ description: 'The ID of the knowledge base this source belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'knowledge_id', length: 36 })
  knowledgeId: string;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this source belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @ApiProperty({ description: 'The ID of the folder this source belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'folder_id', length: 36, nullable: true })
  folderId?: string;

  @ApiProperty({ type: () => KnowledgeEntity, required: false })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.sources, { onDelete: 'CASCADE' })
  knowledge?: KnowledgeEntity;

  @ApiProperty({ type: () => FolderEntity, required: false })
  @ManyToOne(() => FolderEntity, (folder) => folder.sources, { onDelete: 'CASCADE', nullable: true })
  folder?: FolderEntity;

  @ApiProperty({ type: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (tenant) => tenant.sources, { onDelete: 'CASCADE' })
  tenant?: TenantEntity;

  @ApiProperty({ description: 'The timestamp when the source was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the source was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
