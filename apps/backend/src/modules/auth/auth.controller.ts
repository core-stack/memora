import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { env } from "@/env";
import { Public } from "@/shared/decorators/public";
import { HttpPost } from "@/shared/controller";
import { ActiveAccountDto } from "./dto/active-account.dto";
import { CreateAccountDto } from "./dto/create-account.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public(true)
  @Post("login")
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Public(true)
  @Post("logout")
  async logout() {
    return this.authService.logout();
  }

  @Public(true)
  @Post("create-account")
  async createAccount(@Body() body: CreateAccountDto) {
    return this.authService.createAccount(body);
  }

  @Public(true)
  @HttpPost("active-account", !env.REQUIRE_EMAIL_VERIFICATION)
  async activeAccount(@Body() body: ActiveAccountDto) {
    return this.authService.activeAccount(body);
  }

  @Public(true)
  @Post("forget-password")
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }
}