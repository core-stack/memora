import moment from 'moment';
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm';

import { env } from '../env';
import { CreatedBy, TenantId } from '../shared/decorators/context';
import { MemberEntity } from './member.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity('invites')
@Unique('invites_tenant_email_unique', ['tenantId', 'email'])
export class InviteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @TenantId()
  @Column()
  tenantId: string;

  @Column()
  email: string;

  @Column()
  roleId: string;

  @Column({ nullable: true })
  userId?: string;

  @CreatedBy()
  @Column({ name: 'creator_id' })
  creatorId: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => TenantEntity, (t) => t.invites)
  tenant: TenantEntity;

  @ManyToOne(() => RoleEntity, (r) => r.invites)
  role: RoleEntity;

  @ManyToOne(() => UserEntity, (u) => u.invites)
  user?: UserEntity;

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
