import type { KnowledgeFilter, CreateKnowledge, Knowledge, UpdateKnowledge } from "@snipet/schemas"

export interface KnowledgeRoutes {
  "/api/tenant/:tenantId/knowledge": {
    GET: {
      query: KnowledgeFilter;
      params: Partial<{ tenantId: string }>;
      response: Knowledge[];
    },
    POST: {
      body: CreateKnowledge;
      params: Partial<{ tenantId: string }>;
      response: Knowledge;
    }
  },
  "/api/tenant/:tenantId/knowledge/:id": {
    PUT: {
      body: UpdateKnowledge;
      params: Partial<{ tenantId: string, id: string }>;
      response: undefined;
    },
    DELETE: {
      params: Partial<{ tenantId: string, id: string }>;
      response: undefined;
    }
  },
}