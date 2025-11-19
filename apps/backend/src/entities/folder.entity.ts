import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { KnowledgeEntity } from './knowledge.entity';
import { SourceEntity } from './source.entity';

@Entity('folders')
export class FolderEntity {
  @ApiProperty({ description: 'The unique identifier of the folder', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The ID of the associated knowledge base', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ApiProperty({ type: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.folders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: KnowledgeEntity;

  @ApiProperty({ description: 'The name of the folder', example: 'My Documents' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Indicates if the folder is a root folder', example: true, required: false })
  @Column({ nullable: true })
  root?: boolean;

  @ApiProperty({ description: 'The ID of the parent folder', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @ApiProperty({ type: () => FolderEntity })
  @ManyToOne(() => FolderEntity, (folder) => folder.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent?: FolderEntity;

  @ApiProperty({ type: () => FolderEntity, isArray: true })
  @OneToMany(() => FolderEntity, (folder) => folder.parent)
  children: FolderEntity[];

  @ApiProperty({ type: () => SourceEntity, isArray: true })
  @OneToMany(() => SourceEntity, (source) => source.folder)
  sources: SourceEntity[];

  @ApiProperty({ description: 'The ID of the tenant this folder belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ApiProperty({ description: 'The timestamp when the folder was created' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the folder was last updated' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(data: Partial<FolderEntity>) {
    Object.assign(this, data);
  }
}
