import { TenantId, CreatedBy } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LLMType } from '@/shared/enums';
import { KnowledgeLLMEntity } from '../knowledge/knowledge-llm.entity';

@Entity('llms')
@Unique('llms_name_tenant_unique', ['name', 'tenantId'])
export class LlmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  model: string;

  @Column({ type: 'jsonb', default: {} })
  config: Record<string, any>;

  @Column({ type: 'enum', enum: LLMType })
  type: LLMType;

  @TenantId()
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreatedBy()
  @Column({ name: 'creator_id', length: 36, nullable: true })
  creatorId?: string;

  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.llm)
  knowledges: KnowledgeLLMEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
