import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';

import { permissionsToNumber, RoleSchema } from '@snipet/permission';

import { CreatedBy, TenantId } from '../shared/controller/decorators/context';
import { Field } from '../shared/model';
import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

export enum RoleScope {
  TENANT = "TENANT",
  GLOBAL = "GLOBAL",
}

@Entity("roles")
@Unique("roles_key_scope_tenant_id_unique", [ "key", "scope", "tenantId" ])
export class RoleEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the role" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", description: "The key of the role" })
  @Column()
  key: string;

  @Field({ type: "string", description: "The name of the role" })
  @Column()
  name: string;

  @Field({ type: "number", description: "The permissions of the role as a bitmask" })
  @Column()
  permissions: number;

  @Field({ type: "enum", enum: RoleScope, description: "The scope of the role" })
  @Column({ type: "enum", enum: RoleScope, default: RoleScope.TENANT })
  scope: RoleScope;

  @TenantId()
  @Field({ type: "string", uuid: true, required: false, description: "The ID of the tenant this role belongs to" })
  @Column({ name: "tenant_id", nullable: true })
  tenantId?: string;

  @CreatedBy()
  @Field({ type: "string", uuid: true, required: false, description: "The ID of the user who created the role" })
  @Column({ name: "created_by", nullable: true })
  createdById?: string;

  @Field({ type: "date", description: "The timestamp when the role was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the role was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @Field({ type: "class", class: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (t) => t.roles, { onDelete: "CASCADE" })
  tenant?: TenantEntity;

  @Field({ type: "class", class: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.id)
  createdBy?: MemberEntity;

  @Field({ type: "class", class: () => UserEntity, isArray: true, required: false })
  @OneToMany(() => UserEntity, (u) => u.role)
  users?: UserEntity[];

  @Field({ type: "class", class: () => MemberEntity, isArray: true, required: false })
  @OneToMany(() => MemberEntity, (m) => m.role)
  members?: MemberEntity[];

  @Field({ type: "class", class: () => InviteEntity, isArray: true, required: false })
  @OneToMany(() => InviteEntity, (i) => i.role)
  invites?: InviteEntity[];

  constructor(data: Partial<RoleEntity>) {
    Object.assign(this, data);
  }

  static fromRoleSchema(role: RoleSchema) {
    return new RoleEntity({
      key: role.key,
      name: role.name,
      permissions: permissionsToNumber(role.permissions),
      scope: role.scope === "GLOBAL" ? RoleScope.GLOBAL : RoleScope.TENANT
    });
  }
}
