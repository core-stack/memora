import { relations } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { knowledge } from './knowledge';
import { llm } from './llm';

export const knowledgeLLM = pgTable("knowledge_llm", {
  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull().references(() => knowledge.id, { onDelete: "cascade" }),
  llmId: varchar("llm_id", { length: 36 }).notNull().references(() => llm.id, { onDelete: "restrict" }),
}, table => [
  uniqueIndex("knowledge_llm_unique").on(table.knowledgeId, table.llmId),
]);

export const knowledgeLLMRelations = relations(knowledgeLLM, ({ one }) => ({
  knowledge: one(knowledge, {
    fields: [knowledgeLLM.knowledgeId],
    references: [knowledge.id],
  }),
  llm: one(llm, {
    fields: [knowledgeLLM.llmId],
    references: [llm.id],
  }),
}));