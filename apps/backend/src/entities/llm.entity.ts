import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";

import { CreatedBy, TenantId } from "../shared/controller/decorators/context";
import { Field } from "../shared/model";
import { KnowledgeLLMEntity } from "./knowledge-llm.entity";

export enum LLMType {
  EMBEDDING = "EMBEDDING",
  TEXT = "TEXT",
}

@Entity("llms")
@Unique("llms_name_tenant_unique", [ "name", "tenantId" ])
@Unique("llms_default_tenant_type_unique", [ "default", "tenantId", "type" ])
export class LLMEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the LLM" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "boolean", default: false, description: "Indicates if this is the default LLM for its type" })
  @Column({ type: "boolean", default: false })
  default: boolean;

  @Field({ type: "string", min: 1, max: 255, description: "The name of the LLM" })
  @Column({ length: 255 })
  name: string;

  @Field({ type: "string", min: 1, max: 255, description: "The model identifier" })
  @Column({ length: 255 })
  model: string;

  @Field({ type: "class", class: () => Object, description: "The configuration for the LLM" })
  @Column({ type: "jsonb", default: {} })
  config: Record<string, any>;

  @Field({ type: "enum", enum: LLMType, description: "The type of the LLM" })
  @Column({ type: "enum", enum: LLMType })
  type: LLMType;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this LLM belongs to" })
  @Column({ name: "tenant_id", length: 36 })
  tenantId: string;

  @CreatedBy()
  @Field({ type: "string", uuid: true, required: false, nullable: true, description: "The ID of the user who created the LLM" })
  @Column({ name: "creator_id", length: 36, nullable: true })
  creatorId?: string;

  @Field({ type: "class", class: () => KnowledgeLLMEntity, isArray: true, required: false })
  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs?: KnowledgeLLMEntity[];

  @Field({ type: "date", description: "The timestamp when the LLM was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the LLM was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  constructor(data: Partial<LLMEntity>) {
    Object.assign(this, data);
  }
}
