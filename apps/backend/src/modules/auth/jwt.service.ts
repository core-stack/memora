import { env } from "@/env";
import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

export type AccessToken = {
  sessionId: string;
  userId: string;
};

export type RefreshToken = {
  sessionId: string;
  userId: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenDuration: number;
  refreshTokenDuration: number;
};

@Injectable()
export class JWTService {

  generateTokens(sessionId: string, userId: string): Tokens {
    const accessTokenPayload: AccessToken = { userId, sessionId };
    const refreshTokenPayload: RefreshToken = { userId, sessionId };

    const accessToken = jwt.sign(
      accessTokenPayload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_TOKEN_DURATION }
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_TOKEN_DURATION }
    );

    return {
      accessTokenDuration: env.JWT_ACCESS_TOKEN_DURATION,
      refreshTokenDuration: env.JWT_REFRESH_TOKEN_DURATION,
      accessToken,
      refreshToken,
    };
  }

  verifyToken<T = AccessToken | RefreshToken>(token: string): T | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as T;
    } catch {
      return null;
    }
  }
}