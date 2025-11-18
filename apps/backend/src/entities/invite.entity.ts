import moment from 'moment';
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { env } from '../env';
import { CreatedBy, TenantId } from '../shared/decorators/context';
import { MemberEntity } from './member.entity';
import { RoleEntity } from './role.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

@Entity('invites')
@Unique('invites_tenant_email_unique', ['tenantId', 'email'])
export class InviteEntity {
  @ApiProperty({ description: 'The unique identifier of the invite', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this invite belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column()
  tenantId: string;

  @ApiProperty({ description: 'The email address of the person being invited', example: 'user@example.com' })
  @Column()
  email: string;

  @ApiProperty({ description: 'The ID of the role assigned to the invited person', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column()
  roleId: string;

  @ApiProperty({ description: 'The ID of the user being invited, if they already exist', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ nullable: true })
  userId?: string;

  @CreatedBy()
  @ApiProperty({ description: 'The ID of the user who created the invite', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'creator_id' })
  creatorId: string;

  @ApiProperty({ description: 'The timestamp when the invite expires' })
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @ApiProperty({ description: 'The timestamp when the invite was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the invite was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => TenantEntity })
  @ManyToOne(() => TenantEntity, (t) => t.invites)
  tenant: TenantEntity;

  @ApiProperty({ type: () => RoleEntity })
  @ManyToOne(() => RoleEntity, (r) => r.invites)
  role: RoleEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (u) => u.invites)
  user?: UserEntity;

  @ApiProperty({ type: () => MemberEntity })
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
