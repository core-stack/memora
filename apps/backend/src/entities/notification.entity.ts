import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedBy, MemberId, TenantId } from '../shared/decorators/context';
import { MemberEntity } from './member.entity';
import { TenantEntity } from './tenant.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ default: false })
  read: boolean;

  @TenantId()
  @Column()
  tenantId: string;

  @CreatedBy()
  @Column({ name: 'created_by_id', nullable: true })
  createdById?: string;

  @MemberId()
  @Column({ name: 'destination_id' })
  destinationId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date;

  @ManyToOne(() => TenantEntity, (t) => t.notifications)
  tenant: TenantEntity;

  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  createdBy?: MemberEntity;

  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  destination: MemberEntity;
}
