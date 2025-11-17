import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm';

import { CreatedBy, TenantId } from '../shared/decorators/context';
import { KnowledgeLLMEntity } from './knowledge-llm.entity';

export enum LLMType {
  EMBEDDING = 'EMBEDDING',
  TEXT = 'TEXT',
}

@Entity('llms')
@Unique('llms_name_tenant_unique', ['name', 'tenantId'])
@Unique('llms_default_tenant_type_unique', ['default', 'tenantId', 'type'])
export class LLMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  default: boolean;

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

  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs: KnowledgeLLMEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Partial<LLMEntity>) {
    Object.assign(this, data);
  }
}
