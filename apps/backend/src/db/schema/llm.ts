import { relations, sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { llmTypeEnum } from './enums';
import { knowledgeLLM } from './knowledge_llm';

export const llm = pgTable("llm", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 255 }).notNull(),
  
  model: varchar("model", { length: 255 }).notNull(),
  config: jsonb().default({}),
  type: llmTypeEnum().notNull(),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, table => [
  index("llms_tenant_idx").on(table.tenantId),
  uniqueIndex("llms_name_tenant_unique").on(table.name, table.tenantId),
]);

export const llmRelations = relations(llm, ({ many }) => ({
  knowledges: many(knowledgeLLM),
}));