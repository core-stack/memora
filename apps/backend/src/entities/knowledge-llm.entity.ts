// knowledge-llm.entity.ts
import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from "typeorm";

import { Field } from "@/shared/model";

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

  @Field({ type: "class", class: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (k) => k.knowledgeLLMs, { onDelete: "CASCADE" })
  knowledge: KnowledgeEntity;

  @Field({ type: "class", class: () => LLMEntity })
  @ManyToOne(() => LLMEntity, (llm) => llm.knowledgeLLMs, { onDelete: "CASCADE" })
  llm: LLMEntity;

  @Field({ type: "string", uuid: true, description: "The ID of the associated knowledge base" })
  get knowledgeId() {
    return this.knowledge.id;
  }

  @Field({ type: "string", uuid: true, description: "The ID of the associated LLM" })
  get llmId() {
    return this.llm.id;
  }

  @Field({ type: "date", description: "The timestamp when the link was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the link was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
