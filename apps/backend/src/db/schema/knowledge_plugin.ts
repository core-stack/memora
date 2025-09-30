import { relations } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { knowledge } from './knowledge';
import { plugin } from './plugin';

export const knowledgePlugin = pgTable("knowledge_plugin", {
  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull(),
  pluginId: varchar("plugin_id", { length: 36 }).notNull(),
}, (table) => [
  uniqueIndex("knowledge_plugin_unique").on(table.knowledgeId, table.pluginId),
]);

export const knowledgePluginRelations = relations(knowledgePlugin, ({ one }) => ({
  knowledge: one(knowledge, {
    fields: [knowledgePlugin.knowledgeId],
    references: [knowledge.id],
  }),
  plugin: one(plugin, {
    fields: [knowledgePlugin.pluginId],
    references: [plugin.id],
  }),
}));