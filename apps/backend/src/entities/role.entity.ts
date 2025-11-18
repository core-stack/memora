import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'The unique identifier of the role', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The key of the role', example: 'admin' })
  @Column()
  key: string;

  @ApiProperty({ description: 'The name of the role', example: 'Administrator' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The permissions of the role as a bitmask', example: 65535 })
  @Column()
  permissions: number;

  @ApiProperty({ description: 'The scope of the role', enum: RoleScope, example: RoleScope.TENANT })
  @Column({ type: 'enum', enum: RoleScope, default: RoleScope.TENANT })
  scope: RoleScope;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this role belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'tenant_id', nullable: true })
  tenantId?: string;

  @CreatedBy()
  @ApiProperty({ description: 'The ID of the user who created the role', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'created_by', nullable: true })
  createdById?: string;

  @ApiProperty({ description: 'The timestamp when the role was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the role was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => TenantEntity, required: false })
  @ManyToOne(() => TenantEntity, (t) => t.roles, { onDelete: 'CASCADE' })
  tenant?: TenantEntity;

  @ApiProperty({ type: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.id)
  createdBy?: MemberEntity;

  @ApiProperty({ type: () => UserEntity, required: false, isArray: true })
  @OneToMany(() => UserEntity, (u) => u.role)
  users?: UserEntity[];

  @ApiProperty({ type: () => MemberEntity, required: false, isArray: true })
  @OneToMany(() => MemberEntity, (m) => m.role)
  members?: MemberEntity[];

  @ApiProperty({ type: () => InviteEntity, required: false, isArray: true })
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
