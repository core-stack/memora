import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CreatedBy, MemberId, TenantId } from '../shared/decorators/context';
import { MemberEntity } from './member.entity';
import { TenantEntity } from './tenant.entity';

@Entity('notifications')
export class NotificationEntity {
  @ApiProperty({ description: 'The unique identifier of the notification', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the notification', example: 'New Message' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The description of the notification', example: 'You have a new message from John Doe.' })
  @Column()
  description: string;

  @ApiProperty({ description: 'A link associated with the notification', example: '/messages/123', required: false })
  @Column({ nullable: true })
  link?: string;

  @ApiProperty({ description: 'Indicates if the notification has been read', example: false })
  @Column({ default: false })
  read: boolean;

  @TenantId()
  @ApiProperty({ description: 'The ID of the tenant this notification belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column()
  tenantId: string;

  @CreatedBy()
  @ApiProperty({ description: 'The ID of the user who created the notification', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @Column({ name: 'created_by_id', nullable: true })
  createdById?: string;

  @MemberId()
  @ApiProperty({ description: 'The ID of the user who should receive the notification', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column({ name: 'destination_id' })
  destinationId: string;

  @ApiProperty({ description: 'The timestamp when the notification was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the notification was read', required: false })
  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date;

  @ApiProperty({ type: () => TenantEntity })
  @ManyToOne(() => TenantEntity, (t) => t.notifications)
  tenant: TenantEntity;

  @ApiProperty({ type: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  createdBy?: MemberEntity;

  @ApiProperty({ type: () => MemberEntity })
  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  destination: MemberEntity;
}
