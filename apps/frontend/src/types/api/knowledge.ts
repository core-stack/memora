import type { KnowledgeFilter, CreateKnowledge, Knowledge, UpdateKnowledge } from "@memora/schemas"

export interface KnowledgeRoutes {
  "/api/knowledge": {
    GET: {
      query: KnowledgeFilter;
      response: Knowledge[];
    },
    POST: {
      body: CreateKnowledge;
      response: Knowledge;
    }
  },
  "/api/knowledge/:id": {
    PUT: {
      body: UpdateKnowledge;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
}