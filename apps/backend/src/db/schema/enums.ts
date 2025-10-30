import { pgEnum } from 'drizzle-orm/pg-core';

export const indexStatusEnum = pgEnum("index_status", [
  "PENDING",
  "INDEXING",
  "INDEXED",
  "ERROR",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "TEXT",
  "DOC",
  "LINK",
  "VIDEO",
  "AUDIO",
  "IMAGE",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "USER",
  "AI"
]);

export const knowledgeStatusEnum = pgEnum("knowledge_status", [
  "DELETING",
  "DELETE_ERROR",
  "OK"
])

export const llmTypeEnum = pgEnum("llm_type", [
  "EMBEDDING",
  "TEXT",
]);

export const roleScopeEnum = pgEnum("role_scope", ["TENANT", "GLOBAL"]);

export const verificationTypeEnum = pgEnum("verification_type", [
  "ACTIVE_ACCOUNT",
  "RESET_PASSWORD",
]);