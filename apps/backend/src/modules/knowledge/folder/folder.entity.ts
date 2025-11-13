import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SourceEntity } from '../source/source.entity';
import { KnowledgeEntity } from '../knowledge.entity';

@Entity('folders')
export class FolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.folders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: KnowledgeEntity;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  root?: boolean;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => FolderEntity, (folder) => folder.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent?: FolderEntity;

  @OneToMany(() => FolderEntity, (folder) => folder.parent)
  children: FolderEntity[];

  @OneToMany(() => SourceEntity, (source) => source.folder)
  sources: SourceEntity[];

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
