import type { KnowledgeFolderFilter, CreateKnowledgeFolder, UpdateKnowledgeFolder, KnowledgeFolder } from "@memora/schemas";

export interface FolderRoutes {
  "/api/knowledge/:knowledgeSlug/folder": {
    GET: {
      query: KnowledgeFolderFilter;
      params: { knowledgeSlug: string };
      response: KnowledgeFolder[];
    },
    POST: {
      body: CreateKnowledgeFolder;
      params: { knowledgeSlug: string };
      query: { parentId?: string };
      response: KnowledgeFolder;
    }
  },
  "/api/knowledge/:knowledgeSlug/folder/:id": {
    GET: {
      params: { knowledgeSlug: string, id: string };
      response: KnowledgeFolder;
    },
    PUT: {
      body: UpdateKnowledgeFolder;
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    }
  },
}