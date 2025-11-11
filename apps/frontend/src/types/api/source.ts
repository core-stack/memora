import type { GetUploadUrl, SourceFilter, CreateSource, UpdateSource, Source, GetFileUrlResponse } from "@snipet/schemas"

export interface SourceRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:sourceId/view": {
    GET: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, sourceId: string }>;
      response: GetFileUrlResponse;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/upload-url": {
    POST: {
      params: Partial<{ tenantId: string, knowledgeSlug: string }>;
      body: GetUploadUrl;
      response: GetFileUrlResponse;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source": {
    GET: {
      query: SourceFilter;
      params: Partial<{ tenantId: string, knowledgeSlug: string }>;
      response: Source[];
    },
    POST: {
      body: CreateSource;
      params: Partial<{ tenantId: string, knowledgeSlug: string }>;
      response: Source;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:id": {
    GET: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: Source;
    },
    PUT: {
      body: UpdateSource;
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: undefined;
    },
    DELETE: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: undefined;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:id/download-url": {
    GET: {
      params: Partial<{ tenantId: string, knowledgeSlug: string, id: string }>;
      response: GetFileUrlResponse;
    },
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:id/retry": {
    POST: {
      params: Partial<{ tenantId: string, knowledgeSlug?: string, id: string }>;
    }
  }
}