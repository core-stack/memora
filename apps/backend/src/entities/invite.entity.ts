import moment from "moment";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";

import { env } from "../env";
import { CreatedBy, TenantId } from "../shared/controller/decorators/context";
import { Field } from "../shared/model";
import { MemberEntity } from "./member.entity";
import { RoleEntity } from "./role.entity";
import { TenantEntity } from "./tenant.entity";
import { UserEntity } from "./user.entity";

@Entity("invites")
@Unique("invites_tenant_email_unique", [ "tenantId", "email" ])
export class InviteEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the invite" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this invite belongs to" })
  @Column()
  tenantId: string;

  @Field({ type: "string", email: true, description: "The email address of the person being invited" })
  @Column()
  email: string;

  @Field({ type: "string", uuid: true, description: "The ID of the role assigned to the invited person" })
  @Column()
  roleId: string;

  @Field({ type: "string", uuid: true, required: false, description: "The ID of the user being invited, if they already exist" })
  @Column({ nullable: true })
  userId?: string;

  @CreatedBy()
  @Field({ type: "string", uuid: true, description: "The ID of the user who created the invite" })
  @Column({ name: "creator_id" })
  creatorId: string;

  @Field({ type: "date", description: "The timestamp when the invite expires" })
  @Column({ name: "expires_at", type: "timestamptz" })
  expiresAt: Date;

  @Field({ type: "date", description: "The timestamp when the invite was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the invite was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @Field({ type: "class", class: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (t) => t.invites)
  tenant: TenantEntity;

  @Field({ type: "class", class: () => RoleEntity, required: false })
  @ManyToOne(() => RoleEntity, (r) => r.invites)
  role: RoleEntity;

  @Field({ type: "class", class: () => UserEntity, required: false })
  @ManyToOne(() => UserEntity, (u) => u.invites)
  user?: UserEntity;

  @Field({ type: "class", class: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.invites)
  creator: MemberEntity;

  constructor(invite: Partial<InviteEntity>) {
    Object.assign(this, invite);
  }

  setExpiresAt(expiresAt: Date = moment().add(env.DEFAULT_INVITE_EXPIRES).toDate()): this {
    this.expiresAt = expiresAt;
    return this;
  }

  setRoleId(roleId: string): this {
    this.roleId = roleId;
    return this;
  }
}
