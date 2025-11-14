import {
  Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm';

import { CreatedBy, TenantId } from '@/shared/decorators/context';
import { LLMType } from '@/shared/enums';

import { KnowledgeEntity } from '../knowledge/knowledge.entity';

@Entity('llms')
@Unique('llms_name_tenant_unique', ['name', 'tenantId'])
export class LLMEntity {
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

  @ManyToMany(() => KnowledgeEntity, (kllm) => kllm.llms)
  knowledges: KnowledgeEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Partial<LLMEntity>) {
    Object.assign(this, data);
  }
}
