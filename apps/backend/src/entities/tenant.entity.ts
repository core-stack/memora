import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { SourceEntity } from './source.entity';

@Entity('tenants')
export class TenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'background_image' })
  backgroundImage: string;

  @Column({ name: 'disabled_at', type: 'timestamptz', nullable: true })
  disabledAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => MemberEntity, (m) => m.tenant)
  members?: MemberEntity[];

  @OneToMany(() => InviteEntity, (i) => i.tenant)
  invites?: InviteEntity[];

  @OneToMany(() => NotificationEntity, (n) => n.tenant)
  notifications?: NotificationEntity[];

  @OneToMany(() => RoleEntity, (r) => r.tenant)
  roles?: RoleEntity[];

  @OneToMany(() => SourceEntity, (r) => r.tenant)
  sources?: SourceEntity[];
}
