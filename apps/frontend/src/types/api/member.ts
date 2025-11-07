import type { MemberFilterSchema, MemberSchema } from "@snipet/schemas"

export interface MemberRoutes {
  "/api/tenant/:tenantId/member": {
    GET: {
      query: MemberFilterSchema;
      params: { tenantId: string };
      response: MemberSchema[];
    },
  },
}