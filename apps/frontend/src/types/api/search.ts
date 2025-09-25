import type { Fragment, Recent } from "@memora/schemas"

export interface SearchRoutes {
  "/api/knowledge/:knowledgeSlug/search": {
    GET: {
      query: { text: string };
      response: Fragment[];
    }
  },
  "/api/knowledge/:knowledgeSlug/search/recent": {
    GET: {
      response: Recent[];
    }
  },
}