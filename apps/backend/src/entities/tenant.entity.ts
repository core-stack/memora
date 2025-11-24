import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Field } from '../shared/model';
import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { NotificationEntity } from './notification.entity';
import { RoleEntity } from './role.entity';
import { SourceEntity } from './source.entity';

@Entity("tenants")
export class TenantEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the tenant" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", description: "The name of the tenant" })
  @Column()
  name: string;

  @Field({ type: "string", required: false, nullable: true, description: "A brief description of the tenant" })
  @Column({ nullable: true })
  description?: string;

  @Field({ type: "string", nullable: true, description: "The URL of the background image for the tenant" })
  @Column({ name: "background_image", nullable: true })
  backgroundImage: string;

  @Field({ type: "date", required: false, hidden: true, nullable: true, description: "The timestamp when the tenant was disabled" })
  @Column({ name: "disabled_at", type: "timestamptz", nullable: true })
  disabledAt?: Date;

  @Field({ type: "date", description: "The timestamp when the tenant was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", description: "The timestamp when the tenant was last updated" })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @Field({ type: "class", class: () => MemberEntity, isArray: true, required: false, description: "The members associated with this tenant" })
  @OneToMany(() => MemberEntity, (m) => m.tenant)
  members?: MemberEntity[];

  @Field({ type: "class", class: () => InviteEntity, isArray: true, required: false, description: "The invites associated with this tenant" })
  @OneToMany(() => InviteEntity, (i) => i.tenant)
  invites?: InviteEntity[];

  @Field({ type: "class", class: () => NotificationEntity, isArray: true, required: false, description: "The notifications associated with this tenant" })
  @OneToMany(() => NotificationEntity, (n) => n.tenant)
  notifications?: NotificationEntity[];

  @Field({ type: "class", class: () => RoleEntity, isArray: true, required: false, description: "The roles defined within this tenant" })
  @OneToMany(() => RoleEntity, (r) => r.tenant)
  roles?: RoleEntity[];

  @Field({ type: "class", class: () => SourceEntity, isArray: true, required: false, description: "The sources associated with this tenant" })
  @OneToMany(() => SourceEntity, (r) => r.tenant)
  sources?: SourceEntity[];
}
