import {
  Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';

import { TenantId } from '../shared/controller/decorators/context';
import { Field } from '../shared/model';
import { ChatEntity } from './chat.entity';
import { FolderEntity } from './folder.entity';
import { KnowledgeLLMEntity } from './knowledge-llm.entity';
import { MessageEntity } from './message.entity';
import { SourceEntity } from './source.entity';

export enum KnowledgeStatus {
  DELETING = "DELETING",
  DELETE_ERROR = "DELETE_ERROR",
  OK = "OK",
}

@Entity("knowledge")
@Index("knowledge_tenant_idx", [ "tenantId" ])
@Unique("knowledge_tenant_slug_unique", [ "tenantId", "slug" ])
export class KnowledgeEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the knowledge base" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", min: 1, max: 255, description: "The URL-friendly slug for the knowledge base" })
  @Column({ length: 255 })
  slug: string;

  @Field({ type: "string", min: 1, max: 255, description: "The title of the knowledge base" })
  @Column({ length: 255 })
  title: string;

  @Field({ type: "string", required: false, description: "A brief description of the knowledge base" })
  @Column({ type: "text", nullable: true })
  description?: string;

  @Field({ type: "enum", enum: KnowledgeStatus, description: "The status of the knowledge base" })
  @Column({ type: "enum", enum: KnowledgeStatus, default: KnowledgeStatus.OK })
  status: KnowledgeStatus;

  @Field({ type: "string", required: false, description: "The error message if deletion fails" })
  @Column({ name: "delete_error", type: "text", nullable: true })
  deleteError?: string;

  @Field({ type: "number", integer: true, description: "The number of files in the knowledge base" })
  @Column({ name: "file_count", type: "integer", default: 0 })
  files: number;

  @Field({ type: "number", description: "The total storage used by the knowledge base in bytes" })
  // note: depending on your driver you may want a transformer to convert string->number
  @Column({ name: "storage", type: "bigint", default: 0 })
  storage: string | number;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this knowledge base belongs to" })
  @Column({ name: "tenant_id", length: 36 })
  tenantId: string;

  @Field({ type: "date", description: "The timestamp when the knowledge base was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the knowledge base was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  // relations
  @Field({ type: "class", class: () => FolderEntity, isArray: true })
  @OneToMany(() => FolderEntity, (f) => f.knowledge)
  folders: FolderEntity[];

  @Field({ type: "class", class: () => SourceEntity, isArray: true })
  @OneToMany(() => SourceEntity, (s) => s.knowledge)
  sources: SourceEntity[];

  @Field({ type: "class", class: () => ChatEntity, isArray: true })
  @OneToMany(() => ChatEntity, (c) => c.knowledge)
  chats: ChatEntity[];

  @Field({ type: "class", class: () => MessageEntity, isArray: true })
  @OneToMany(() => MessageEntity, (c) => c.knowledge)
  messages: MessageEntity[];

  @Field({ type: "class", class: () => KnowledgeLLMEntity, isArray: true })
  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs: KnowledgeLLMEntity[];
}
