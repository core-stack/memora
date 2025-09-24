import type { Fragment } from "@memora/schemas"

export interface SearchRoutes {
  "/api/knowledge/:knowledgeSlug/search/term": {
    GET: {
      query: { query: string };
      response: Fragment[];
    }
  },
}