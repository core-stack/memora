import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { env } from "@/env";
import { Public } from "@/shared/decorators/public";
import { HttpPost } from "@/shared/controller";
import { ActiveAccountDto } from "./dto/active-account.dto";
import { CreateAccountDto } from "./dto/create-account.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto } from "./dto/login.dto";

@Public('login', 'logout', 'createAccount', 'activeAccount', 'forgetPassword')
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post("logout")
  async logout() {
    return this.authService.logout();
  }

  @Post("create-account")
  async createAccount(@Body() body: CreateAccountDto) {
    return this.authService.createAccount(body);
  }

  @HttpPost("active-account", !env.REQUIRE_EMAIL_VERIFICATION)
  async activeAccount(@Body() body: ActiveAccountDto) {
    return this.authService.activeAccount(body);
  }

  @Post("forget-password")
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }
}