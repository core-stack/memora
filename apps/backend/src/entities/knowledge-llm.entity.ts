// knowledge-llm.entity.ts
import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { KnowledgeEntity } from './knowledge.entity';
import { LLMEntity } from './llm.entity';

@Entity('knowledge_llms')
@Unique('knowledge_llm_unique', ['knowledge', 'llm'])
@Index('knowledge_llm_knowledge_idx', ['knowledge'])
@Index('knowledge_llm_llm_idx', ['llm'])
export class KnowledgeLLMEntity {
  @ApiProperty({ description: 'The unique identifier of the knowledge-llm link', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Indicates if this is the default LLM for the knowledge base', example: true })
  @Column({ type: 'boolean', default: false })
  default: boolean;

  @ApiProperty({ type: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (k) => k.knowledgeLLMs, { onDelete: 'CASCADE' })
  knowledge: KnowledgeEntity;

  @ApiProperty({ type: () => LLMEntity })
  @ManyToOne(() => LLMEntity, (llm) => llm.knowledgeLLMs, { onDelete: 'CASCADE' })
  llm: LLMEntity;

  @ApiProperty({ description: 'The ID of the associated knowledge base', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  get knowledgeId() {
    return this.knowledge.id;
  };

  @ApiProperty({ description: 'The ID of the associated LLM', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  get llmId() {
    return this.llm.id;
  };

  @ApiProperty({ description: 'The timestamp when the link was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the link was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
