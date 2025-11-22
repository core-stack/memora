import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { TenantId } from '../shared/controller/decorators/context';
import { Field } from '../shared/model';
import { InviteEntity } from './invite.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity("members")
@Index([ "tenantId", "userId" ], { unique: true })
export class MemberEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the member" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "boolean", default: false, description: "Indicates if the member is the owner of the tenant" })
  @Column({ default: false })
  owner: boolean;

  @Field({ type: "string", uuid: true, description: "The ID of the user" })
  @Column({ name: "user_id" })
  userId: string;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant" })
  @Column({ name: "tenant_id" })
  tenantId: string;

  @Field({ type: "string", uuid: true, description: "The ID of the role assigned to the member" })
  @Column({ name: "role_id" })
  roleId: string;

  @Field({ type: "date", description: "The timestamp when the member was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the member was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @Field({ type: "class", class: () => UserEntity, required: false })
  @ManyToOne(() => UserEntity, (u) => u.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  @Field({ type: "class", class: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (t) => t.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant?: TenantEntity;

  @Field({ type: "class", class: () => RoleEntity, required: false })
  @ManyToOne(() => RoleEntity, (r) => r.members, { onDelete: "SET NULL" })
  @JoinColumn({ name: "role_id" })
  role?: RoleEntity;

  @Field({ type: "class", class: () => NotificationEntity, isArray: true, required: false })
  @OneToMany(() => NotificationEntity, (n) => n.destination)
  notifications?: NotificationEntity[];

  @Field({ type: "class", class: () => InviteEntity, isArray: true, required: false })
  @OneToMany(() => InviteEntity, (i) => i.creator)
  invites?: InviteEntity[];

  constructor(data: Omit<MemberEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
