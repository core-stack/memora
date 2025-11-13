import { CreatedBy, TenantId } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { RoleEntity } from '../role/role.entity';
import { InviteEntity } from '../invite/invite.entity';
import { NotificationEntity } from '../notification/notification.entity';

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
