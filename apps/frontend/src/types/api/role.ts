import type { RoleFilterSchema, RoleSchema, CreateRoleSchema, UpdateRoleSchema } from "@snipet/schemas"

export interface RoleRoutes {
  "/api/tenant/:tenantId/role": {
    GET: {
      query: RoleFilterSchema;
      response: RoleSchema[];
    },
    POST: {
      body: CreateRoleSchema;
      response: RoleSchema;
    }
  },
  "/api/tenant/:tenantId/role/:id": {
    PUT: {
      body: UpdateRoleSchema;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  }
}