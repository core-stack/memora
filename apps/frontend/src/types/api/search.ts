import type { SourceFragment, Recent } from "@snipet/schemas"

export interface SearchRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/search": {
    GET: {
      query: { text: string };
      params: { tenantId: string, knowledgeSlug: string };
      response: SourceFragment[];
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/search/recent": {
    GET: {
      params: { tenantId: string, knowledgeSlug: string };
      response: Recent[];
    }
  },
}