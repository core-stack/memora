import type { TagFilter, CreateTag, UpdateTag, Tag } from "@snipet/schemas"

export interface TagRoutes {
  "/api/tenant/:tenantId/tag": {
    GET: {
      query: TagFilter;
      params: { tenantId: string };
      response: Tag[];
    },
    POST: {
      body: CreateTag;
      params: { tenantId: string };
      response: Tag;
    }
  },
  "/api/tenant/:tenantId/tag/:id": {
    PUT: {
      body: UpdateTag;
      params: { tenantId: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { tenantId: string, id: string };
      response: undefined;
    }
  },
}