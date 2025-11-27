import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CreatedBy, MemberId, TenantId } from "../shared/controller/decorators/context";
import { Field } from "../shared/model";
import { MemberEntity } from "./member.entity";
import { TenantEntity } from "./tenant.entity";

@Entity("notifications")
export class NotificationEntity {
  @Field({ type: "string", uuid: true, description: "The unique identifier of the notification" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ type: "string", description: "The title of the notification" })
  @Column()
  title: string;

  @Field({ type: "string", description: "The description of the notification" })
  @Column()
  description: string;

  @Field({ type: "string", required: false, description: "A link associated with the notification" })
  @Column({ nullable: true })
  link?: string;

  @Field({ type: "boolean", default: false, description: "Indicates if the notification has been read" })
  @Column({ default: false })
  read: boolean;

  @TenantId()
  @Field({ type: "string", uuid: true, description: "The ID of the tenant this notification belongs to" })
  @Column()
  tenantId: string;

  @CreatedBy()
  @Field({ type: "string", uuid: true, required: false, description: "The ID of the user who created the notification" })
  @Column({ name: "created_by_id", nullable: true })
  createdById?: string;

  @MemberId()
  @Field({ type: "string", uuid: true, description: "The ID of the user who should receive the notification" })
  @Column({ name: "destination_id" })
  destinationId: string;

  @Field({ type: "date", description: "The timestamp when the notification was created" })
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Field({ type: "date", required: false, description: "The timestamp when the notification was read" })
  @Column({ name: "read_at", type: "timestamptz", nullable: true })
  readAt?: Date;

  @Field({ type: "class", class: () => TenantEntity })
  @ManyToOne(() => TenantEntity, (t) => t.notifications)
  tenant: TenantEntity;

  @Field({ type: "class", class: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  createdBy?: MemberEntity;

  @Field({ type: "class", class: () => MemberEntity, required: false })
  @ManyToOne(() => MemberEntity, (m) => m.notifications)
  destination: MemberEntity;
}
