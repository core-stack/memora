import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { TenantId } from '../shared/decorators/context';
import { InviteEntity } from './invite.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity('members')
@Index(['tenantId', 'userId'], { unique: true })
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
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ManyToOne(() => TenantEntity, (t) => t.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: TenantEntity;

  @ManyToOne(() => RoleEntity, (r) => r.members, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity;

  @OneToMany(() => NotificationEntity, (n) => n.destination)
  notifications?: NotificationEntity[];

  @OneToMany(() => InviteEntity, (i) => i.creator)
  invites?: InviteEntity[];

  constructor(data: Omit<MemberEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
