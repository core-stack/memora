import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'The unique identifier of the LLM', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Indicates if this is the default LLM for its type', example: true })
  @Column({ type: 'boolean', default: false })
  default: boolean;

  @ApiProperty({ description: 'The name of the LLM', example: 'My Text Model' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'The model identifier', example: 'gpt-3.5-turbo' })
  @Column({ length: 255 })
  model: string;

  @ApiProperty({ description: 'The configuration for the LLM', example: { temperature: 0.7 } })
  @Column({ type: 'jsonb', default: {} })
  config: Record<string, any>;

  @ApiProperty({ description: 'The type of the LLM', enum: LLMType, example: LLMType.TEXT })
  @Column({ type: 'enum', enum: LLMType })
  type: LLMType;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this LLM belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreatedBy()
  @ApiProperty({ description: 'The ID of the user who created the LLM', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'creator_id', length: 36, nullable: true })
  creatorId?: string;

  @ApiProperty({ type: () => KnowledgeLLMEntity, isArray: true })
  @OneToMany(() => KnowledgeLLMEntity, (kllm) => kllm.knowledge)
  knowledgeLLMs: KnowledgeLLMEntity[];

  @ApiProperty({ description: 'The timestamp when the LLM was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the LLM was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Partial<LLMEntity>) {
    Object.assign(this, data);
  }
}
