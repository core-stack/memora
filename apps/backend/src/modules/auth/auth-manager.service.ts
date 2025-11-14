import { isUUID } from '@/utils/uuid';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';
import { AccessToken, JWTService, RefreshToken } from './jwt.service';
import { Provider } from './providers/types';
import { Store } from './store/types';
import { Session } from './types';
import { UserEntity } from '../user/user.entity';

export const PROVIDERS = Symbol("providers");

@Injectable()
export class AuthManager {
  constructor(
    private readonly jwt: JWTService,
    private readonly store: Store<Session>,
    @Inject(PROVIDERS) private readonly providers: Record<string, Provider>,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  async oauth2GetUrl(provider: string) {
    return this.providers[provider].getAuthUrl();
  }

  async oauth2Callback(provider: string, code: string) {
    const { providerAccountId, email, name, image } = await this.providers[provider].callback(code);

    const acc = await this.accountService.createIfNotExists({
      email,
      emailVerified: true,
      name,
      image,
      provider,
      providerAccountId,
    })

    const user = await this.userService.findFirstWithMemberRoleTenant({ where: { id: acc.userId } })
    if (!user) throw new UnauthorizedException();
    return await this.createSessionAndTokens(user);
  }

  async createSessionAndTokens(user: UserEntity) {
    const sessionId = crypto.randomUUID();

    const token = this.jwt.generateTokens(sessionId, user.id);

    const session: Session = {
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || "",
        permissions: user.role?.permissions ?? 0,
      },
      refreshToken: token.refreshToken,
      createdAt: new Date(),
      status: "active",
      tenants: user.members?.map((m) => ({
        id: m.tenantId,
        memberId: m.id,
        permissions: m.role?.permissions ?? 0,
      })) ?? [],
      lastSeen: new Date(),
      id: sessionId,
    };
    await this.store.set(session.id, session, { expiry: token.refreshTokenDuration });
    return { token, session };
  }

  async getSession(accessToken?: string): Promise<Session | undefined> {
    if (!accessToken) throw new UnauthorizedException();
    const token = this.jwt.verifyToken<AccessToken>(accessToken);
    if (!token) throw new UnauthorizedException();
    const { sessionId } = token;
    const session = await this.store.get(sessionId);

    if (!session) throw new UnauthorizedException();
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session;
  }

  async reloadSession(sessionId: string) {
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedException();
    const user = await this.userService.findFirstWithMemberRoleTenant({ where: { id: session.user.id } });

    if (!user) throw new UnauthorizedException();
    session.tenants = user.members?.map((m) => ({
      id: m.tenantId,
      memberId: m.id,
      permissions: m.role?.permissions ?? 0,
    })) ?? [];
    session.status = "active";
    session.user.permissions = user.role?.permissions ?? 0;
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session;
  }

  async finishSession(refreshTokenOrSessionId: string) {
    if (isUUID(refreshTokenOrSessionId)) {
      const session = await this.store.get(refreshTokenOrSessionId);
      if (!session) return;
      session.lastSeen = new Date();
      session.status = "revoked";
      await this.store.set(session.id, session);
    }
    const token = this.jwt.verifyToken<RefreshToken>(refreshTokenOrSessionId);
    if (!token) return;
    const session = await this.store.get(token.sessionId);
    if (!session) return;
    session.lastSeen = new Date();
    session.status = "revoked";
    await this.store.set(session.id, session);
  }

  async refreshToken(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const tokenData = this.jwt.verifyToken<RefreshToken>(refreshToken);
    if (!tokenData) throw new UnauthorizedException();

    const { sessionId } = tokenData;
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedException();
    if (session.refreshToken !== refreshToken) throw new UnauthorizedException();

    const user = await this.userService.findFirstWithMemberRoleTenant({ where: { id: session.user.id } });
    if (!user) throw new UnauthorizedException();
    return await this.createSessionAndTokens(user);
  }

  listSessions(cursor: number = 0, limit: number = 10) {
    return this.store.getMany(cursor, limit);
  }
}
