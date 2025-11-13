import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { KnowledgeEntity } from '../knowledge.entity';
import { MessageEntity } from './message/message.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'knowledge_id', type: 'uuid' })
  knowledgeId: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: KnowledgeEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
