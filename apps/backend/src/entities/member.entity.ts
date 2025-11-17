import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { TenantId } from '../shared/decorators/context';
import { InviteEntity } from './invite.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity('members')
@Index('member_user_idx', ['userId'])
@Index('member_tenant_idx', ['tenantId'])
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  owner: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @TenantId()
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (u) => u.members, { onDelete: 'CASCADE' })
  user?: UserEntity;

  @ManyToOne(() => TenantEntity, (t) => t.members, { onDelete: 'CASCADE' })
  tenant?: TenantEntity;

  @ManyToOne(() => RoleEntity, (r) => r.members, { onDelete: 'SET NULL' })
  role?: RoleEntity;

  @OneToMany(() => NotificationEntity, (n) => n.destination)
  notifications?: NotificationEntity[];

  @OneToMany(() => InviteEntity, (i) => i.creator)
  invites?: InviteEntity[];

  constructor(data: Omit<MemberEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
