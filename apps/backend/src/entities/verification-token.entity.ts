import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Field } from "../shared/model";
import { UserEntity } from "./user.entity";

export enum VerificationType {
  ACTIVE_ACCOUNT = "ACTIVE_ACCOUNT",
  RESET_PASSWORD = "RESET_PASSWORD",
}

@Entity("verification_tokens")
export class VerificationTokenEntity {
  @Field({ type: "string", uuid: true })
  @PrimaryGeneratedColumn("uuid")
  token: string;

  @Field({ type: "enum", enum: VerificationType })
  @Column({ enum: VerificationType, type: "enum" })
  type: VerificationType;

  @Field({ type: "date" })
  @Column({ type: "timestamptz" })
  expires: Date;

  @Field({ type: "string", uuid: true })
  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Field({ type: "date" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @Field({ type: "class", class: () => UserEntity, required: false })
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  constructor(data: Partial<VerificationTokenEntity>) {
    Object.assign(this, data);
  }
}
