import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { tenant } from "./tenant";
import { member } from "./member";

export const notification = pgTable("notifications", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  link: text("link"),
  read: boolean("read").default(false),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),
  createdById: varchar("created_by_id", { length: 36 }),
  destinationId: varchar("destination_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  tenant: one(tenant, {
    fields: [notification.tenantId],
    references: [tenant.id],
  }),
  createdBy: one(member, {
    fields: [notification.createdById],
    references: [member.id],
  }),
  destination: one(member, {
    fields: [notification.destinationId],
    references: [member.id],
  }),
}));
