import type { GetSelfUserSchema } from "@snipet/schemas";

export interface UserRoutes {
  "/api/user/self": {
    GET: {
      response: GetSelfUserSchema;
    }
  }
}