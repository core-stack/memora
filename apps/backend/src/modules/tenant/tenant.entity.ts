import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InviteEntity } from '../invite/invite.entity';
import { MemberEntity } from '../member/member.entity';
import { RoleEntity } from '../role/role.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { SourceEntity } from '../knowledge/source/source.entity';

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
