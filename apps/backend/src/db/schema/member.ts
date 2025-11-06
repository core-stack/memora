import { relations, sql } from 'drizzle-orm';
import { boolean, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { invite } from './invite';
import { notification } from './notification';
import { role } from './role';
import { tenant } from './tenant';
import { user } from './user';

export const member = pgTable("members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  owner: boolean("owner").notNull().default(false),

  userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenant.id, { onDelete: "cascade" }),
  roleId: varchar("role_id", { length: 36 }).references(() => role.id, { onDelete: "set null" }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("member_user_idx").on(table.userId),
  index("member_tenant_idx").on(table.tenantId),
]);

export const memberRelations = relations(member, ({ one, many }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  tenant: one(tenant, {
    fields: [member.tenantId],
    references: [tenant.id],
  }),
  role: one(role, {
    fields: [member.roleId],
    references: [role.id],
  }),
  notifications: many(notification),
  invites: many(invite),
}));
