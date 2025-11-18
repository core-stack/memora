import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TenantId } from '../shared/decorators/context';
import { InviteEntity } from './invite.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity('members')
@Index(['tenantId', 'userId'], { unique: true })
export class MemberEntity {
  @ApiProperty({ description: 'The unique identifier of the member', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Indicates if the member is the owner of the tenant', example: false })
  @Column({ default: false })
  owner: boolean;

  @ApiProperty({ description: 'The ID of the user', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'user_id' })
  userId: string;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ApiProperty({ description: 'The ID of the role assigned to the member', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'role_id' })
  roleId: string;

  @ApiProperty({ description: 'The timestamp when the member was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the member was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (u) => u.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ApiProperty({ type: () => TenantEntity })
  @ManyToOne(() => TenantEntity, (t) => t.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: TenantEntity;

  @ApiProperty({ type: () => RoleEntity })
  @ManyToOne(() => RoleEntity, (r) => r.members, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity;

  @ApiProperty({ type: () => NotificationEntity, isArray: true })
  @OneToMany(() => NotificationEntity, (n) => n.destination)
  notifications?: NotificationEntity[];

  @ApiProperty({ type: () => InviteEntity, isArray: true })
  @OneToMany(() => InviteEntity, (i) => i.creator)
  invites?: InviteEntity[];

  constructor(data: Omit<MemberEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
