import type { GetUploadUrl, SourceFilter, CreateSource, UpdateSource } from "@memora/schemas"

export interface SourceRoutes {
  "/api/knowledge/:knowledgeSlug/source/:sourceId/view": {
    GET: {
      params: { knowledgeSlug: string, sourceId: string }
    }
  },
  "/api/knowledge/:knowledgeSlug/source/upload-url": {
    POST: {
      params: { knowledgeSlug: string }
      body: GetUploadUrl
    }
  },
  "/api/knowledge/:knowledgeSlug/source": {
    GET: {
      query: SourceFilter;
      params: { knowledgeSlug: string };
    },
    POST: {
      body: CreateSource;
      params: { knowledgeSlug: string };
    }
  },
  "/api/knowledge/:knowledgeSlug/source/:id": {
    PUT: {
      body: UpdateSource;
      params: { knowledgeSlug: string, id: string };
    },
    DELETE: {
      params: { knowledgeSlug: string, id: string };
    }
  },
}