// knowledge-llm.entity.ts
import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from "typeorm";

import { Field } from "../shared/model";
import { KnowledgeEntity } from "./knowledge.entity";
import { LLMEntity } from "./llm.entity";

@Entity("knowledge_llms")
@Unique("knowledge_llm_unique", [ "knowledge", "llm" ])
@Index("knowledge_llm_knowledge_idx", [ "knowledge" ])
@Index("knowledge_llm_llm_idx", [ "llm" ])
export class KnowledgeLLMEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the knowledge-llm link" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "boolean", default: false, description: "Indicates if this is the default LLM for the knowledge base" })
  @Column({ type: "boolean", default: false })
  default: boolean;

  @Field({ type: "class", class: () => KnowledgeEntity, required: false })
  @ManyToOne(() => KnowledgeEntity, (k) => k.knowledgeLLMs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_id" })
  knowledge?: KnowledgeEntity;

  @Field({ type: "class", class: () => LLMEntity, required: false })
  @ManyToOne(() => LLMEntity, (llm) => llm.knowledgeLLMs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "llm_id" })
  llm?: LLMEntity;

  @Field({ type: "string", uuid: true, description: "The ID of the associated knowledge base" })
  @Column({ name: "knowledge_id", type: "uuid" })
  knowledgeId: string;

  @Field({ type: "string", uuid: true, description: "The ID of the associated LLM" })
  @Column({ name: "llm_id", type: "uuid" })
  llmId: string;

  @Field({ type: "date", description: "The timestamp when the link was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the link was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  constructor(data: Partial<KnowledgeLLMEntity>) {
    Object.assign(this, data);
  }
}
