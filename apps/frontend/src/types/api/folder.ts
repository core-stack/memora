import type { KnowledgeFolderFilter, CreateKnowledgeFolder, UpdateKnowledgeFolder } from "@memora/schemas";

export interface FolderRoutes {
  "/api/knowledge/:knowledgeSlug/folder": {
    GET: {
      query: KnowledgeFolderFilter;
      params: { knowledgeSlug: string };
    },
    POST: {
      body: CreateKnowledgeFolder;
      params: { knowledgeSlug: string };
    }
  },
  "/api/knowledge/:knowledgeSlug/folder/:id": {
    PUT: {
      body: UpdateKnowledgeFolder;
      params: { knowledgeSlug: string, id: string };
    },
    DELETE: {
      params: { knowledgeSlug: string, id: string };
    }
  },
}