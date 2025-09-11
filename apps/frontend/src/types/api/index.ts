import type { ChatRoutes } from "./chat";
import type { FolderRoutes } from "./folder";
import type { KnowledgeRoutes } from "./knowledge";
import type { MessageRoutes } from "./message";
import type { SourceRoutes } from "./source";
import type { TagRoutes } from "./tag";

export type ApiRoutes =
  TagRoutes & FolderRoutes & KnowledgeRoutes & SourceRoutes & ChatRoutes & MessageRoutes;