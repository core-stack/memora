import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { tenant } from "./tenant";
import { role } from "./role";
import { user } from "./user";
import { member } from "./member";

export const invite = pgTable("invites", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),

  roleId: varchar("role_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }),
  creatorId: varchar("creator_id", { length: 36 }).notNull(),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("invites_tenant_email_unique").on(table.tenantId, table.email),
]);

export const inviteRelations = relations(invite, ({ one }) => ({
  tenant: one(tenant, {
    fields: [invite.tenantId],
    references: [tenant.id],
  }),
  role: one(role, {
    fields: [invite.roleId],
    references: [role.id],
  }),
  user: one(user, {
    fields: [invite.userId],
    references: [user.id],
  }),
  creator: one(member, {
    fields: [invite.creatorId],
    references: [member.id],
  }),
}));
