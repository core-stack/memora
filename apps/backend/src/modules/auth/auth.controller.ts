import { env } from "@/env";
import { ApiResponses, HttpGet, HttpPost } from "@/shared/controller/decorators";
import { Public } from "@/shared/controller/decorators/public";
import { Body, Controller } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { ActiveAccountDto } from "./dto/active-account.dto";
import { CreateAccountDto } from "./dto/create-account.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";

@Public("login", "logout", "createAccount", "activeAccount", "forgetPassword")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponses([ { status: 200, type: String, isArray: true, description: "The list of active providers" } ])
  @HttpGet("providers")
  async providers(): Promise<string[]> {
    return this.authService.getActiveProviders();
  }

  @HttpPost("login")
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(body);
  }

  @HttpPost("logout")
  async logout(): Promise<void> {
    return this.authService.logout();
  }

  @HttpPost("create-account")
  async createAccount(@Body() body: CreateAccountDto): Promise<void>  {
    return this.authService.createAccount(body);
  }

  @HttpPost("active-account", { ignore: !env.REQUIRE_EMAIL_VERIFICATION })
  async activeAccount(@Body() body: ActiveAccountDto): Promise<void>  {
    return this.authService.activeAccount(body);
  }

  @HttpPost("forget-password")
  async forgetPassword(@Body() body: ForgetPasswordDto): Promise<void>  {
    return this.authService.forgetPassword(body);
  }
}
