import type { GetUploadUrl, SourceFilter, CreateSource, UpdateSource, Source, GetFileUrlResponse,  } from "@memora/schemas"

export interface SourceRoutes {
  "/api/knowledge/:knowledgeSlug/source/:sourceId/view": {
    GET: {
      params: { knowledgeSlug: string, sourceId: string };
      response: GetFileUrlResponse;
    }
  },
  "/api/knowledge/:knowledgeSlug/source/upload-url": {
    POST: {
      params: { knowledgeSlug: string };
      body: GetUploadUrl;
      response: GetFileUrlResponse;
    }
  },
  "/api/knowledge/:knowledgeSlug/source": {
    GET: {
      query: SourceFilter;
      params: { knowledgeSlug: string };
      response: Source[];
    },
    POST: {
      body: CreateSource;
      params: { knowledgeSlug: string };
      response: Source;
    }
  },
  "/api/knowledge/:knowledgeSlug/source/:id": {
    GET: {
      params: { knowledgeSlug: string, id: string };
      response: Source;
    },
    PUT: {
      body: UpdateSource;
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    }
  },
}