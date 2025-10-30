import { Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request } from "express";
import { ZodBody } from "@/shared/decorators/zod-body";
import { createAccountSchema, activeAccountSchema, forgetPasswordSchema } from "@snipet/schemas";
import type { ActiveAccountSchema, CreateAccountSchema, ForgetPasswordSchema } from "@snipet/schemas";
import { HttpContext } from "@/generics/http-context";
import { HttpPost } from "@/generics";
import { env } from "@/env";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("create-account")
  async createAccount(
    @Req() req: Request,
    @ZodBody(createAccountSchema) body: CreateAccountSchema
  ) {
    return this.authService.createAccount(body, { http: new HttpContext(req) });
  }

  @HttpPost("active-account", !env.REQUIRE_EMAIL_VERIFICATION)
  async activeAccount(
    @Req() req: Request,
    @ZodBody(activeAccountSchema) body: ActiveAccountSchema
  ) {
    return this.authService.activeAccount(
      body.token,
      { http: new HttpContext(req) }
    );
  }

  @Post("forget-password")
  async forgetPassword(@Req() req: Request, @ZodBody(forgetPasswordSchema) body: ForgetPasswordSchema) {
    return this.authService.forgetPassword(body.email, { http: new HttpContext(req) });
  }
}