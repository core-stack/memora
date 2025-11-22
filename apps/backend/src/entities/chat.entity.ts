import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Field } from '../shared/model';
import { KnowledgeEntity } from './knowledge.entity';
import { MessageEntity } from './message.entity';

@Entity("chats")
export class ChatEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the chat" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", min: 1, max: 50, description: "The name of the chat" })
  @Column({ length: 50 })
  name: string;

  @Field({ type: "string", uuid: true, description: "The ID of the associated knowledge base" })
  @Column({ name: "knowledge_id", type: "uuid" })
  knowledgeId: string;

  @Field({ type: "class", class: () => KnowledgeEntity })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.chats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_id" })
  knowledge: KnowledgeEntity;

  @Field({ type: "class", class: () => MessageEntity, isArray: true })
  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @Field({ type: "string", uuid: true, description: "The ID of the tenant this chat belongs to" })
  @Column({ name: "tenant_id", type: "uuid" })
  tenantId: string;

  @Field({ type: "date", description: "The timestamp when the chat was created" })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the chat was last updated" })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  constructor(data: Partial<ChatEntity>) {
    Object.assign(this, data);
  }
}
