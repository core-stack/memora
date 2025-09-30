import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { knowledgePlugin } from "./knowledge_plugin";

export const plugin = pgTable("plugin", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 50 }),
  type: varchar("type", { length: 255 }).notNull(),
  description: text(),
  whenUse: text(),
  config: jsonb().default({}),

  tenantId: varchar("tenant_id", { length: 36 }).notNull(),
  pluginRegistry: varchar("plugin_registry").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("plugins_tenant_idx").on(table.tenantId),
  index("plugins_type_idx").on(table.type),
  index("plugins_plugin_registry_idx").on(table.pluginRegistry),
]);

export const pluginsRelations = relations(plugin, ({ many }) => ({
  knowledges: many(knowledgePlugin),
}))