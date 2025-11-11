import type { InviteFilterSchema, InviteSchema, CreateInviteSchema } from "@snipet/schemas"

export interface InviteRoutes {
  "/api/tenant/:tenantId/invite": {
    GET: {
      query: InviteFilterSchema;
      params: { tenantId: string };
      response: InviteSchema[];
    },
    POST: {
      body: CreateInviteSchema;
      params: { tenantId: string };
      response: InviteSchema;
    }
  },
  "/api/tenant/:tenantId/invite/:id": {
    DELETE: {
      params: Partial<{ tenantId: string, id: string }>;
      response: undefined;
    }
  },
}