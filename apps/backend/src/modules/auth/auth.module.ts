import { env } from '@/env';
import { DatabaseModule } from '@/infra/database/database.module';
import { SecurityModule } from '@/infra/security/security.module';
import { EmailModule } from '@/jobs/email/email.module';
import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { VerificationTokenModule } from '../verification-token/verification-token.module';
import { AuthManager, PROVIDERS } from './auth-manager.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { GoogleProvider } from './providers/google';
import { Provider } from './providers/types';
import { MemoryStore } from './store/memory.store';
import { RedisStore } from './store/redis.store';
import { Store } from './store/types';
import { Session } from './types';

const useProvider = (name: string, provider: Provider, use: boolean) => {
  return use ? { [name]: provider } : {};
}
@Module({
  controllers: [AuthController],
  providers: [
    AuthManager, JWTService, AuthService,
    {
      provide: Store<Session>,
      useFactory: () => {
        if (env.STORE == "redis") return new RedisStore({ url: env.REDIS_STORE_URL });
        return new MemoryStore();
      }
    },
    {
      provide: PROVIDERS,
      useValue: {
        ...useProvider(
          "google",
          GoogleProvider({
            GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID!,
            GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET!,
            REDIRECT_URI: env.GOOGLE_REDIRECT_URI!
          }),
          env.GOOGLE_ENABLED
        ),
      } as Record<string, Provider>
    }
  ],
  exports: [ AuthManager, AuthService ],
  imports: [
    EmailModule,
    UserModule,
    AccountModule,
    VerificationTokenModule,
    SecurityModule,
    DatabaseModule,
    RoleModule
  ],
})
export class AuthModule {}