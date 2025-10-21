import { relations, sql } from 'drizzle-orm';
import { index, pgTable, varchar } from 'drizzle-orm/pg-core';

import { knowledge } from './knowledge';

export const knowledgeTag = pgTable("knowledge_tag", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull().references(() => knowledge.id, { onDelete: "cascade" }),
  tenantId: varchar("tenant_id", { length: 36 }).notNull(),
}, (table) => [
  index("knowledge_tag_knowledge_idx").on(table.knowledgeId),
  index("knowledge_tag_tenant_idx").on(table.tenantId),
]);

export const knowledgePluginRelations = relations(knowledgeTag, ({ one }) => ({
  knowledge: one(knowledge, {
    fields: [knowledgeTag.knowledgeId],
    references: [knowledge.id],
  }),
}));