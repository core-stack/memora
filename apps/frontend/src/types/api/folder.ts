import type { KnowledgeFolderFilter, CreateKnowledgeFolder, UpdateKnowledgeFolder, KnowledgeFolder } from "@snipet/schemas";

export interface FolderRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/folder": {
    GET: {
      query: KnowledgeFolderFilter;
      params: Partial<{ tenantId: string, knowledgeSlug: string }>;
      response: KnowledgeFolder[];
    },
    POST: {
      body: CreateKnowledgeFolder;
      params: Partial<{ tenantId: string, knowledgeSlug: string }>;
      query: { parentId?: string };
      response: KnowledgeFolder;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/folder/:id": {
    GET: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: KnowledgeFolder;
    },
    PUT: {
      body: UpdateKnowledgeFolder;
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: undefined;
    },
    DELETE: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: undefined;
    }
  },
}