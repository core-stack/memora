import { relations, sql } from 'drizzle-orm';
import { index, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { sourceTag } from './source_tag';

export const tag = pgTable("tags", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("tags_name_tenant_unique").on(table.name, table.tenantId),
  index("tags_tenant_idx").on(table.tenantId),
]);

export const tagRelations = relations(tag, ({ many }) => ({
  sources: many(sourceTag),
}));