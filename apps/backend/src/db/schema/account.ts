import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const account = pgTable("accounts", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),

  userId: varchar("user_id", { length: 36 }).notNull(),
}, (table) => [
  uniqueIndex("accounts_provider_provider_account_id_unique").on(
    table.provider,
    table.providerAccountId,
  ),
]);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
