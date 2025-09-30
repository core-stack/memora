import { relations, sql } from "drizzle-orm";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { chat } from "./chat";
import { messageRoleEnum } from "./enums";
import { knowledge } from "./knowledge";

export const message = pgTable("message", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  messageRole: messageRoleEnum("message_role").notNull(),

  content: varchar("content", { length: 50 }).notNull(),

  chatId: varchar("chat_id", { length: 36 }).notNull(),
  knowledgeId: varchar("knowledge_id", { length: 36 }).notNull(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("messages_chat_idx").on(table.chatId),
  index("messages_knowledge_idx").on(table.knowledgeId),
  index("messages_tenant_idx").on(table.tenantId),
  index("messages_message_role_idx").on(table.messageRole),
]);

export const messagesRelations = relations(message, ({ one, many }) => ({
  knowledge: one(knowledge, {
    fields: [message.knowledgeId],
    references: [knowledge.id]
  }),
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id]
  })
}));