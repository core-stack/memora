import { env } from '@/env';
import { ErrorResponse } from '@/shared/controller';
import { ApiResponses, HttpGet, HttpPost } from '@/shared/controller/decorators';
import { Public } from '@/shared/controller/decorators/public';
import { Body, Controller, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ActiveAccountDto } from './dto/active-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GetOAuth2UrlResponseDto } from './dto/get-oauth2-url.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

import type { Response } from 'express';

@Public("login", "logout", "createAccount", "activeAccount", "forgetPassword")
@Controller("auth")
export class AuthController {
  private logger = new Logger(AuthController.name);
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

  @ApiParam({ name: "provider", type: String, required: true, description: 'The provider name', example: "google" })
  @ApiResponses([
    { status: 200, type: GetOAuth2UrlResponseDto, description: "The oauth2 url response" },
    { status: 404, description: "The provider not found", type: ErrorResponse },
    { status: 500, description: "Internal server error", type: ErrorResponse },
  ])
  @HttpPost(":provider")
  async oauth2(@Param("provider") provider: string): Promise<GetOAuth2UrlResponseDto> {
    return this.authService.getOAuth2Url(provider);
  }
  
  @ApiParam({ name: "provider", type: String, required: true, description: 'The provider name', example: "google" })
  @ApiQuery({ name: "code", type: String, required: true, description: 'The provider code', example: "code" })
  @ApiResponses([
    { status: 200, type: LoginResponseDto, description: "The login response" },
    { status: 404, description: "The provider not found", type: ErrorResponse },
    { status: 500, description: "Internal server error", type: ErrorResponse },
  ])
  @HttpGet(":provider/callback")
  async oauth2Callback(
    @Param("provider") provider: string,
    @Query("code") code: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const { redirect } = await this.authService.oauth2Callback(provider, code);
      return res.redirect(redirect);
    } catch (error) {
      this.logger.error(error);      
      return res.redirect("/");
    }
  }
}
