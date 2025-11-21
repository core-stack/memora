import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Field } from "@/shared/model";

import { ChatEntity } from "./chat.entity";
import { KnowledgeEntity } from "./knowledge.entity";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

@Entity("messages")
export class MessageEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the message" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "enum", enum: MessageRole, description: "The role of the message sender" })
  @Column({ name: "message_role", type: "enum", enum: MessageRole })
  messageRole: MessageRole;

  @Field({ type: "string", description: "The content of the message" })
  @Column({ type: "text" })
  content: string;

  @Field({ type: "string", uuid: true, description: "The ID of the chat this message belongs to" })
  @Column({ name: "chat_id", type: "uuid" })
  chatId: string;

  @Field({ type: "class", class: () => ChatEntity, required: false })
  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chat_id" })
  chat?: ChatEntity;

  @Field({ type: "string", uuid: true, description: "The ID of the knowledge base associated with this message" })
  @Column({ name: "knowledge_id", type: "uuid" })
  knowledgeId: string;

  @Field({ type: "class", class: () => KnowledgeEntity, required: false })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_id" })
  knowledge?: KnowledgeEntity;

  @Field({ type: "string", uuid: true, description: "The ID of the tenant this message belongs to" })
  @Column({ name: "tenant_id", type: "uuid" })
  tenantId: string;

  @Field({ type: "date", description: "The timestamp when the message was created" })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the message was last updated" })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  constructor(message: Partial<MessageEntity>) {
    Object.assign(this, message);
  }
}
