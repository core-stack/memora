import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';

import { permissionsToNumber, RoleSchema } from '@snipet/permission';

import { CreatedBy, TenantId } from '../shared/decorators/context';
import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

export enum RoleScope {
  TENANT = 'TENANT',
  GLOBAL = 'GLOBAL',
}

@Entity('roles')
@Unique('roles_key_scope_tenant_id_unique', ['key', 'scope', 'tenantId'])
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  permissions: number;

  @Column({ type: 'enum', enum: RoleScope, default: RoleScope.TENANT })
  scope: RoleScope;

  @TenantId()
  @Column({ name: 'tenant_id', nullable: true })
  tenantId?: string;

  @CreatedBy()
  @Column({ name: 'created_by', nullable: true })
  createdById?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => TenantEntity, (t) => t.roles, { onDelete: 'CASCADE' })
  tenant?: TenantEntity;

  @ManyToOne(() => MemberEntity, (m) => m.id)
  createdBy?: MemberEntity;

  @OneToMany(() => UserEntity, (u) => u.role)
  users?: UserEntity[];

  @OneToMany(() => MemberEntity, (m) => m.role)
  members?: MemberEntity[];

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
      scope: role.scope === "GLOBAL" ? RoleScope.GLOBAL : RoleScope.TENANT,
    });
  }
}
