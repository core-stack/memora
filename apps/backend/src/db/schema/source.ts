import { relations, sql } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { indexStatusEnum, sourceTypeEnum } from './enums';
import { folder } from './folder';
import { knowledge } from './knowledge';
import { sourceTag } from './source_tag';

export const source = pgTable("sources", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  originalName: varchar("original_name", { length: 255 }),
  extension: varchar("extension", { length: 20 }),
  contentType: varchar("content_type", { length: 100 }),
  size: integer("size"),
  url: varchar("url", { length: 2048 }),
  width: integer("width"),
  height: integer("height"),
  metadata: jsonb("metadata"),

  sourceType: sourceTypeEnum("source_type").notNull(),

  indexStatus: indexStatusEnum("index_status").notNull(),
  indexError: text("index_error"),

  memoryId: varchar("memory_id", { length: 36 }),

  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull(),
  folderId: varchar("folder_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("sources_memory_idx").on(table.memoryId),
  index("sources_index_status_idx").on(table.indexStatus),
]);

export const sourceRelations = relations(source, ({ one, many }) => ({
  knowledge: one(knowledge, {
    fields: [source.knowledgeId],
    references: [knowledge.id],
  }),
  folder: one(folder, {
    fields: [source.folderId],
    references: [folder.id],
  }),
  tags: many(sourceTag),
}));