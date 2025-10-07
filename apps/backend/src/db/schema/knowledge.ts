import { relations, sql } from 'drizzle-orm';
import {
  bigint, index, integer, pgTable, text, timestamp, uniqueIndex, varchar
} from 'drizzle-orm/pg-core';

import { chat } from './chat';
import { folder } from './folder';
import { knowledgeTag } from './knowledge_tag';
import { plugin } from './plugin';
import { source } from './source';

export const knowledge = pgTable("knowledge", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),

  files: integer("file_count").default(0),
  storage: bigint({ mode: "number" }).default(0),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("knowledge_tenant_idx").on(table.tenantId),
  uniqueIndex("knowledge_tenant_slug_unique").on(table.tenantId, table.slug),
]);

export const knowledgeRelations = relations(knowledge, ({ many }) => ({
  folders: many(folder),
  sources: many(source),
  plugins: many(plugin),
  chats: many(chat),
  tags: many(knowledgeTag),
}));