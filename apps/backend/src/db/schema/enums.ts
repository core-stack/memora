import { pgEnum } from 'drizzle-orm/pg-core';

export const indexStatusEnum = pgEnum("index_status", [
  "PENDING",
  "INDEXING",
  "INDEXED",
  "ERROR",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "TEXT",
  "FILE",
  "LINK",
  "VIDEO",
  "AUDIO",
  "IMAGE",
]);
