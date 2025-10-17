import type { SourceFragment, Recent } from "@snipet/schemas"

export interface SearchRoutes {
  "/api/knowledge/:knowledgeSlug/search": {
    GET: {
      query: { text: string };
      response: SourceFragment[];
    }
  },
  "/api/knowledge/:knowledgeSlug/search/recent": {
    GET: {
      response: Recent[];
    }
  },
}