import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthManager, PROVIDERS } from "./auth-manager.service";
import { JWTService } from "./jwt.service";
import { AuthService } from "./auth.service";
import { EmailModule } from "@/jobs/email/email.module";
import { Store } from "./store/types";
import { Session } from "./types";
import { RedisStore } from "./store/redis.store";
import { env } from "@/env";
import { MemoryStore } from "./store/memory.store";
import { Provider } from "./providers/types";
import { GoogleProvider } from "./providers/google";
import { UserModule } from "../user/user.module";
import { AccountModule } from "../account/account.module";
import { VerificationTokenModule } from "../verification-token/verification-token.module";
import { SecurityModule } from "@/infra/security/security.module";
import { DatabaseModule } from "@/infra/database/database.module";

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
  exports: [],
  imports: [EmailModule, UserModule, AccountModule, VerificationTokenModule, SecurityModule, DatabaseModule],
})
export class AuthModule {}