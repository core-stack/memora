import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { account } from "./account";
import { invite } from "./invite";
import { member } from "./member";
import { role } from "./role";
import { verificationToken } from "./verification-token";

export const user = pgTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 255 }),
  email: text().unique(),
  password: text(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),

  roleId: varchar("role_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ one, many }) => ({
  role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
  accounts: many(account),
  invites: many(invite),
  members: many(member),
  verificationTokens: many(verificationToken),
}));
