import bcrypt from "bcrypt";
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Field } from "../shared/model";
import { AccountEntity } from "./account.entity";
import { InviteEntity } from "./invite.entity";
import { MemberEntity } from "./member.entity";
import { RoleEntity } from "./role.entity";
import { VerificationTokenEntity } from "./verification-token.entity";

@Entity("users")
export class UserEntity {
  @Field({ type: "string", description: "The unique identifier of the user", uuid: true })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", description: "The name of the user", max: 255, min: 1 })
  @Column({ length: 255 })
  name: string;

  @Field({ type: "string", description: "The email of the user", email: true })
  @Column({ unique: true, type: "text" })
  email: string;

  @Field({ type: "string", password: true, min: 6, max: 100, hidden: true })
  @Column({ type: "text", nullable: true })
  password?: string;

  @Field({
    type: "date",
    description: "The date the user email was verified",
    example: "2025-10-05T14:48:00.000Z",
    nullable: true
  })
  @Column({ name: "email_verified", type: "timestamptz", nullable: true })
  emailVerified?: Date | null;

  @Field({ type: "string", description: "The image of the user", url: true, nullable: true })
  @Column({ type: "text", nullable: true })
  image?: string | null;

  @Field({ type: "string", description: "The unique identifier of the role", uuid: true })
  @Column({ name: "role_id", type: "uuid" })
  roleId: string;

  @Field({ type: "date", description: "The date the user was created", example: "2025-10-05T14:48:00.000Z" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The date the user was updated", example: "2025-10-05T14:48:00.000Z" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  // Relations
  @Field({ type: "class", class: () => RoleEntity, required: false })
  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: false })
  @JoinColumn({ name: "role_id" })
  role?: RoleEntity;

  @Field({ type: "class", class: () => AccountEntity, isArray: true, required: false })
  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts?: AccountEntity[];

  @Field({ type: "class", class: () => InviteEntity, isArray: true, required: false })
  @OneToMany(() => InviteEntity, (invite) => invite.user)
  invites?: InviteEntity[];

  @Field({ type: "class", class: () => MemberEntity, isArray: true, required: false })
  @OneToMany(() => MemberEntity, (member) => member.user)
  members?: MemberEntity[];

  @Field({ type: "class", class: () => VerificationTokenEntity, isArray: true, required: false })
  @OneToMany(() => VerificationTokenEntity, (token) => token.user)
  verificationTokens?: VerificationTokenEntity[];

  constructor(user: Omit<Partial<UserEntity>, "password">) {
    Object.assign(this, user);
  }

  async setPassword(password: string): Promise<this> {
    this.password = await bcrypt.hash(password, 10);
    return this;
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  verifyEmail(verify: boolean = true): this {
    this.emailVerified = verify ? new Date() : undefined;
    return this;
  }
}
