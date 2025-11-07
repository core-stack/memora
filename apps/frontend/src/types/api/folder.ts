import type { KnowledgeFolderFilter, CreateKnowledgeFolder, UpdateKnowledgeFolder, KnowledgeFolder } from "@snipet/schemas";

export interface FolderRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/folder": {
    GET: {
      query: KnowledgeFolderFilter;
      params: { tenantId: string, knowledgeSlug: string };
      response: KnowledgeFolder[];
    },
    POST: {
      body: CreateKnowledgeFolder;
      params: { tenantId: string, knowledgeSlug: string };
      query: { parentId?: string };
      response: KnowledgeFolder;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/folder/:id": {
    GET: {
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: KnowledgeFolder;
    },
    PUT: {
      body: UpdateKnowledgeFolder;
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: undefined;
    }
  },
}