import type { CreateTenantSchema, TenantFilterSchema, TenantSchema, UpdateTenantSchema } from "@snipet/schemas"

export type TenantRoutes = {
  "/api/tenant": {
    GET: {
      query: TenantFilterSchema;
      response: TenantSchema[];
    },
    POST: {
      body: CreateTenantSchema;
      response: TenantSchema;
    }
  },
  "/api/tenant/:id": {
    PUT: {
      body: UpdateTenantSchema;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
}