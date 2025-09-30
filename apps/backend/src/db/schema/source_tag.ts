import { relations } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { source } from './source';
import { tag } from './tag';

export const sourceTag = pgTable("source_tags", {
  sourceId: varchar("source_id", { length: 36 }).notNull(),
  tagId: varchar("tag_id", { length: 36 }).notNull(),
}, (table) => [
  uniqueIndex("source_tag_unique").on(table.sourceId, table.tagId),
]);

export const sourceTagRelations = relations(sourceTag, ({ one }) => ({
  source: one(source, {
    fields: [sourceTag.sourceId],
    references: [source.id],
  }),
  tag: one(tag, {
    fields: [sourceTag.tagId],
    references: [tag.id],
  }),
}));