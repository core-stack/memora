import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { member } from "./member";
import { tenant } from "./tenant";
import { user } from "./user";
import { invite } from "./invite";
import { roleScopeEnum } from "./enums";

export const role = pgTable("roles", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  key: varchar("key", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  permissions: integer("permissions").notNull(),

  scope: roleScopeEnum("scope").notNull().default("TENANT"),

  tenantId: varchar("tenant_id", { length: 36 }),
  creatorId: varchar("creator_id", { length: 36 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("roles_key_scope_unique").on(table.key, table.scope),
]);

export const roleRelations = relations(role, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [role.tenantId],
    references: [tenant.id],
  }),
  creator: one(member, {
    fields: [role.creatorId],
    references: [member.id],
  }),
  users: many(user),
  members: many(member),
  invites: many(invite),
}));
