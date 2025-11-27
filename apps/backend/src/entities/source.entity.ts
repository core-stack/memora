import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { ApiExtraModels } from "@nestjs/swagger";

import { KnowledgeId, TenantId } from "../shared/controller/decorators/context";
import { Field } from "../shared/model";
import { FolderEntity } from "./folder.entity";
import { KnowledgeEntity } from "./knowledge.entity";
import {
  SourceAudioMetadata, SourceDocMetadata, SourceImageMetadata, SourceType, SourceVideoMetadata
} from "./metadata.types";
import { TenantEntity } from "./tenant.entity";

import type { SourceMetadata } from "./metadata.types";
export enum IndexStatus {
  PENDING = "PENDING",
  INDEXING = "INDEXING",
  INDEXED = "INDEXED",
  ERROR = "ERROR",
}

@Entity("sources")
@Index("sources_memory_idx", [ "memoryId" ])
@Index("sources_key_idx", [ "key" ])
@Index("sources_index_status_idx", [ "indexStatus" ])
@ApiExtraModels(SourceDocMetadata, SourceImageMetadata, SourceVideoMetadata, SourceAudioMetadata)
export class SourceEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the source" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", description: "The key of the source file in the storage" })
  @Column({ type: "text" })
  key: string;

  @Field({ type: "string", description: "The path of the source file" })
  @Column({ type: "text" })
  path: string;

  @Field({ type: "string", min: 1, max: 255, description: "The name of the source" })
  @Column({ length: 255 })
  name: string;

  @Field({ type: "string", required: false, description: "A brief description of the source" })
  @Column({ type: "text", nullable: true })
  description?: string;

  @Field({ type: "string", required: false, min: 1, max: 255, description: "The original name of the file" })
  @Column({ name: "original_name", length: 255, nullable: true })
  originalName?: string;

  @Field({
    type: "oneOf",
    classes: [
      () => SourceDocMetadata,
      () => SourceImageMetadata,
      () => SourceVideoMetadata,
      () => SourceAudioMetadata
    ],
    description: "The metadata of the source"
  })
  @Column({ type: "jsonb" })
  metadata: SourceMetadata;

  @Field({ type: "enum", enum: SourceType, description: "The type of the source" })
  @Column({
    name: "source_type",
    type: "enum",
    enum: SourceType
  })
  sourceType: SourceType;

  @Field({ type: "enum", enum: IndexStatus, description: "The indexing status of the source" })
  @Column({
    name: "index_status",
    type: "enum",
    enum: IndexStatus
  })
  indexStatus: IndexStatus;

  @Field({ type: "string", required: false, description: "The error message if indexing fails" })
  @Column({ name: "index_error", type: "text", nullable: true })
  indexError?: string;

  @Field({ type: "string", uuid: true, required: false, description: "The ID of the memory associated with this source" })
  @Column({ name: "memory_id", length: 36, nullable: true })
  memoryId?: string;

  @KnowledgeId()
  @Field({ type: "string", uuid: true, description: "The ID of the knowledge base this source belongs to" })
  @Column({ name: "knowledge_id", length: 36 })
  knowledgeId: string;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this source belongs to" })
  @Column({ name: "tenant_id", length: 36 })
  tenantId: string;

  @Field({ type: "string", uuid: true, required: false, description: "The ID of the folder this source belongs to" })
  @Column({ name: "folder_id", length: 36, nullable: true })
  folderId?: string;

  @Field({ type: "class", class: () => KnowledgeEntity, required: false })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.sources, { onDelete: "CASCADE" })
  knowledge?: KnowledgeEntity;

  @Field({ type: "class", class: () => FolderEntity, required: false })
  @ManyToOne(() => FolderEntity, (folder) => folder.sources, { onDelete: "CASCADE", nullable: true })
  folder?: FolderEntity;

  @Field({ type: "class", class: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (tenant) => tenant.sources, { onDelete: "CASCADE" })
  tenant?: TenantEntity;

  @Field({ type: "date", description: "The timestamp when the source was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the source was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  constructor(source: Partial<SourceEntity>) {
    Object.assign(this, source);
  }
}
