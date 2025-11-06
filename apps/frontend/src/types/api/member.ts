import type { MemberFilterSchema, MemberSchema } from "@snipet/schemas"

export interface MemberRoutes {
  "/api/member": {
    GET: {
      query: MemberFilterSchema;
      response: MemberSchema[];
    },
  },
}