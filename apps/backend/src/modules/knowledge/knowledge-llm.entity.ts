import { CreatedBy, TenantId } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

import { KnowledgeEntity } from '../knowledge/knowledge.entity';
import { LlmEntity } from '../llm/llm.entity';

@Entity('knowledge_llms')
@Unique('knowledge_llm_unique', ['knowledge', 'llm'])
export class KnowledgeLLMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @TenantId()
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreatedBy()
  @Column({ name: 'creator_id', length: 36, nullable: true })
  creatorId?: string;

  @ManyToOne(() => KnowledgeEntity, (k) => k.llms, {
    onDelete: 'CASCADE',
  })
  knowledge: KnowledgeEntity;

  @ManyToOne(() => LlmEntity, (l) => l.knowledges, {
    onDelete: 'RESTRICT',
  })
  llm: LlmEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
