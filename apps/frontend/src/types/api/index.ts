import type { ChatRoutes } from "./chat";
import type { FolderRoutes } from "./folder";
import type { KnowledgeRoutes } from "./knowledge";
import type { MessageRoutes } from "./message";
import type { PluginRoutes } from "./plugin";
import type { SourceRoutes } from "./source";
import type { TagRoutes } from "./tag";
import type { PluginRegistryRoutes } from "./plugin-registry";

export type ApiRoutes =
  TagRoutes & FolderRoutes & KnowledgeRoutes & SourceRoutes & ChatRoutes & MessageRoutes & PluginRoutes & PluginRegistryRoutes;