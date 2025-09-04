import { relations, sql } from 'drizzle-orm';
import { boolean, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { knowledge } from './knowledge';

export const folder = pgTable("folder", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull(),

  name: varchar("name", { length: 100 }).notNull(),
  root: boolean("root"),

  parentId: varchar("parent_id", { length: 36 }),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("folder_tenant_idx").on(table.tenantId)
]);


export const folderRelations = relations(folder, ({ one, many }) => ({
  knowledge: one(knowledge, {
    fields: [folder.knowledgeId],
    references: [knowledge.id],
    relationName: "knowledge_folder",
  }),

  parent: one(folder, {
    fields: [folder.parentId],
    references: [folder.id],
    relationName: "parent_children",
  }),

  children: many(folder, {
    relationName: "parent_children",
  }),

  // sources: many(source) <-- deixamos pra depois quando tivermos a tabela Source
}));