import type { UpdateSource, KnowledgeFilter, CreateKnowledge } from "@memora/schemas"

export interface KnowledgeRoutes {
  "/api/knowledge": {
    GET: {
      query: KnowledgeFilter;
    },
    POST: {
      body: CreateKnowledge;
    }
  },
  "/api/knowledge/:id": {
    PUT: {
      body: UpdateSource;
      params: { id: string };
    },
    DELETE: {
      params: { id: string };
    }
  },
}