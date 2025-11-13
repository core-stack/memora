import { CreatedBy, TenantId } from '@/shared/decorators/context';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantEntity } from '../tenant/tenant.entity';
import { RoleEntity } from '../role/role.entity';
import { UserEntity } from '../user/user.entity';
import { MemberEntity } from '../member/member.entity';

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
}
