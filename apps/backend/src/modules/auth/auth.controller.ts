import { Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { ZodBody } from "@/shared/decorators/zod-body";
import { createAccountSchema, activeAccountSchema, forgetPasswordSchema, loginSchema } from "@snipet/schemas";
import type { ActiveAccountSchema, CreateAccountSchema, ForgetPasswordSchema, LoginSchema } from "@snipet/schemas";
import { HttpContext } from "@/generics/http-context";
import { HttpPost } from "@/generics";
import { env } from "@/env";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Req() req: Request, @Res() res: Response, @ZodBody(loginSchema) body: LoginSchema) {
    const result = await this.authService.login(body, { http: new HttpContext(req, res) });
    return res.send(result);
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    return res.send(this.authService.logout({ http: new HttpContext(req, res) }));
  }

  @Post("create-account")
  async createAccount(@Req() req: Request, @ZodBody(createAccountSchema) body: CreateAccountSchema) {
    return this.authService.createAccount(body, { http: new HttpContext(req) });
  }

  @HttpPost("active-account", !env.REQUIRE_EMAIL_VERIFICATION)
  async activeAccount(@Req() req: Request, @ZodBody(activeAccountSchema) body: ActiveAccountSchema) {
    return this.authService.activeAccount(body, { http: new HttpContext(req) });
  }

  @Post("forget-password")
  async forgetPassword(@Req() req: Request, @ZodBody(forgetPasswordSchema) body: ForgetPasswordSchema) {
    return this.authService.forgetPassword(body, { http: new HttpContext(req) });
  }
}