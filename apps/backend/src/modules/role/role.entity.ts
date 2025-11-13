import { CreatedBy, TenantId } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantEntity } from '../tenant/tenant.entity';
import { MemberEntity } from '../member/member.entity';
import { UserEntity } from '../user/user.entity';
import { InviteEntity } from '../invite/invite.entity';

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

  constructor(data: Omit<RoleEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
