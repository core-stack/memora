// knowledge-llm.entity.ts
import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';

import { KnowledgeEntity } from './knowledge.entity';
import { LLMEntity } from './llm.entity';

@Entity('knowledge_llms')
@Unique('knowledge_llm_unique', ['knowledge', 'llm'])
@Index('knowledge_llm_knowledge_idx', ['knowledge'])
@Index('knowledge_llm_llm_idx', ['llm'])
export class KnowledgeLLMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  default: boolean;

  @ManyToOne(() => KnowledgeEntity, (k) => k.knowledgeLLMs, { onDelete: 'CASCADE' })
  knowledge: KnowledgeEntity;

  @ManyToOne(() => LLMEntity, (llm) => llm.knowledgeLLMs, { onDelete: 'CASCADE' })
  llm: LLMEntity;

  get knowledgeId() {
    return this.knowledge.id;
  };

  get llmId() {
    return this.llm.id;
  };

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
