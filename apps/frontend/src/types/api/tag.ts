import type { TagFilter, CreateTag, UpdateTag, Tag } from "@snipet/schemas"

export interface TagRoutes {
  "/api/tag": {
    GET: {
      query: TagFilter;
      response: Tag[];
    },
    POST: {
      body: CreateTag;
      response: Tag;
    }
  },
  "/api/tag/:id": {
    PUT: {
      body: UpdateTag;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
}