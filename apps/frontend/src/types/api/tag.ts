import type { TagFilter, CreateTag, UpdateTag } from "@memora/schemas"

export interface TagRoutes {
  "/api/tag": {
    GET: {
      query: TagFilter;
    },
    POST: {
      body: CreateTag;
    }
  },
  "/api/tag/:id": {
    PUT: {
      body: UpdateTag;
      params: { id: string };
    },
    DELETE: {
      params: { id: string };
    }
  },
}