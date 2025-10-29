import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./user";
import { verificationTypeEnum } from "./enums";

export const verificationToken = pgTable("verification_tokens", {
  type: verificationTypeEnum("type").notNull(),
  token: varchar("token", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  expires: timestamp("expires", { withTimezone: true }).notNull(),

  userId: varchar("user_id", { length: 36 }).notNull(),
});

export const verificationTokenRelations = relations(verificationToken, ({ one }) => ({
  user: one(user, {
    fields: [verificationToken.userId],
    references: [user.id],
  }),
}));
