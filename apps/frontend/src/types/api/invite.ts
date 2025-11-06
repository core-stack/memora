import type { InviteFilterSchema, InviteSchema, CreateInviteSchema } from "@snipet/schemas"

export interface InviteRoutes {
  "/api/invite": {
    GET: {
      query: InviteFilterSchema;
      response: InviteSchema[];
    },
    POST: {
      body: CreateInviteSchema;
      response: InviteSchema;
    }
  },
  "/api/invite/:id": {
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
}