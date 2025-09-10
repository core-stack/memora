import { relations, sql } from "drizzle-orm";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { knowledge } from "./knowledge";

export const chat = pgTable("chat", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 50 }).notNull(),

  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("chat_knowledge_idx").on(table.knowledgeId),
]);

export const chatRelations = relations(chat, ({ many, one }) => ({
  knowledge: one(knowledge, {
    fields: [chat.knowledgeId],
    references: [knowledge.id]
  }),
}));
