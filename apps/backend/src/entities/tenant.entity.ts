import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { SourceEntity } from './source.entity';

@Entity('tenants')
export class TenantEntity {
  @ApiProperty({ description: 'The unique identifier of the tenant', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the tenant', example: 'My Awesome Tenant' })
  @Column()
  name: string;

  @ApiProperty({ description: 'A brief description of the tenant', example: 'This is a tenant for managing various services.', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'The URL of the background image for the tenant', example: 'https://example.com/background.jpg' })
  @Column({ name: 'background_image' })
  backgroundImage: string;

  @Column({ name: 'disabled_at', type: 'timestamptz', nullable: true })
  disabledAt?: Date;

  @ApiProperty({ description: 'The timestamp when the tenant was created', example: '2022-12-31T23:59:59.000Z', readOnly: true })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the tenant was last updated', example: '2023-01-01T10:30:00.000Z', readOnly: true })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => [MemberEntity], description: 'The members associated with this tenant' })
  @OneToMany(() => MemberEntity, (m) => m.tenant)
  members?: MemberEntity[];

  @ApiProperty({ type: () => [InviteEntity], description: 'The invites associated with this tenant' })
  @OneToMany(() => InviteEntity, (i) => i.tenant)
  invites?: InviteEntity[];

  @ApiProperty({ type: () => [NotificationEntity], description: 'The notifications associated with this tenant' })
  @OneToMany(() => NotificationEntity, (n) => n.tenant)
  notifications?: NotificationEntity[];

  @ApiProperty({ type: () => [RoleEntity], description: 'The roles defined within this tenant' })
  @OneToMany(() => RoleEntity, (r) => r.tenant)
  roles?: RoleEntity[];

  @ApiProperty({ type: () => [SourceEntity], description: 'The sources associated with this tenant' })
  @OneToMany(() => SourceEntity, (r) => r.tenant)
  sources?: SourceEntity[];
}
