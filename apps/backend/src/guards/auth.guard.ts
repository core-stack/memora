import { Response } from 'express';

import { AuthRequest } from '@/@types/auth-request';
import { AuthManager } from '@/modules/auth/auth-manager.service';
import { Session } from '@/modules/auth/types';
import { Public } from '@/shared/decorators/public';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authManager: AuthManager,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const publicRoute = this.reflector.get(Public, context.getHandler());

    const accessToken: string | undefined = request.cookies?.["access-token"];
    const refreshToken: string | undefined = request.cookies?.["refresh-token"];

    let session: Session | undefined;
    try {
      if (accessToken) session = await this.authManager.getSession(accessToken);
      
      if (!session && refreshToken) {
        const refreshResult = await this.authManager.refreshToken(refreshToken);
        session = refreshResult.session;

        response.cookie("access-token", refreshResult.token.accessToken, {
          maxAge: refreshResult.token.accessTokenDuration,
          httpOnly: true,
          path: "/",
        })

        response.cookie("refresh-token", refreshResult.token.refreshToken, {
          maxAge: refreshResult.token.refreshTokenDuration,
          httpOnly: true,
          path: "/",
        });
      }
    } catch {
      if (publicRoute) return true;
      throw new UnauthorizedException();
    }
    if (publicRoute) return true;

    if (!session) throw new UnauthorizedException();
    request.session = session;    
    return true;
  }
}