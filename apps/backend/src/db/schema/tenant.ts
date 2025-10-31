import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { invite } from './invite';
import { member } from './member';
import { notification } from './notification';
import { role } from './role';

export const tenant = pgTable("tenants", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  backgroundImage: text("background_image").notNull(),

  disabledAt: timestamp("disabled_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const tenantRelations = relations(tenant, ({ many }) => ({
  members: many(member),
  invites: many(invite),
  notifications: many(notification),
  roles: many(role),
}));