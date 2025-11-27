import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { KnowledgeId, TenantId } from "@/shared/controller/decorators";

import { Field } from "../shared/model";
import { KnowledgeEntity } from "./knowledge.entity";
import { SourceEntity } from "./source.entity";

@Entity("folders")
export class FolderEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the folder" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @KnowledgeId()
  @Field({ type: "string", uuid: true, description: "The ID of the associated knowledge base" })
  @Column({ name: "knowledge_id", type: "uuid" })
  knowledgeId: string;

  @Field({ type: "class", class: () => KnowledgeEntity, required: false })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.folders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_id" })
  knowledge?: KnowledgeEntity;

  @Field({ type: "string", min: 1, max: 100, description: "The name of the folder" })
  @Column({ length: 100 })
  name: string;

  @Field({ type: "boolean", required: false, nullable: true, description: "Indicates if the folder is a root folder" })
  @Column({ nullable: true })
  root?: boolean;

  @Field({ type: "string", uuid: true, required: false, nullable: true, description: "The ID of the parent folder" })
  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: string;

  @Field({ type: "class", class: () => FolderEntity, required: false, nullable: true })
  @ManyToOne(() => FolderEntity, (folder) => folder.children, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_id" })
  parent?: FolderEntity;

  @Field({ type: "class", class: () => FolderEntity, isArray: true, required: false })
  @OneToMany(() => FolderEntity, (folder) => folder.parent)
  children?: FolderEntity[];

  @Field({ type: "class", class: () => SourceEntity, isArray: true, required: false })
  @OneToMany(() => SourceEntity, (source) => source.folder)
  sources?: SourceEntity[];

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this folder belongs to" })
  @Column({ name: "tenant_id", type: "uuid" })
  tenantId: string;

  @Field({ type: "date", description: "The timestamp when the folder was created" })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the folder was last updated" })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  constructor(data: Partial<FolderEntity>) {
    Object.assign(this, data);
  }
}
