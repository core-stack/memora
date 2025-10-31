import type { ActiveAccountSchema, CreateAccountSchema, ForgetPasswordSchema, LoginSchema } from "@snipet/schemas"

export interface AuthRoutes {
  "/api/auth/login": {
    POST: {
      body: LoginSchema;
      response: { redirect?: string };
    }
  },
  "/api/auth/create-account": {
    POST: {
      body: CreateAccountSchema;
      response: undefined;
    }
  },
  "/api/auth/active-account": {
    POST: {
      body: ActiveAccountSchema;
      response: undefined;
    }
  },
  "/api/auth/forget-password": {
    POST: {
      body: ForgetPasswordSchema;
      response: undefined;
    }
  },
  "/api/auth/logout": {
    POST: {
      response: undefined;
    }
  }
}