import basicAuth from 'express-basic-auth';
import { ClsModule } from 'nestjs-cls';

import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

import { env } from './env';
import { AuthGuard } from './guards/auth.guard';
import { CacheModule } from './infra/cache/cache.module';
import { PromptModule } from './infra/prompt/prompt.module';
import { SecurityModule } from './infra/security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { MemoryModule } from './modules/memory/memory.module';
import { UserModule } from './modules/user/user.module';
import { PluginRegistryModule } from './plugin-registry/plugin-registry.module';
import { ContextInterceptor } from './shared/interceptor/context';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // LLMModule,
    // LLMManagerModule,
    // IngestModule,
    // DeleteKnowledgeModule,
    // EmailModule,
    // AccountModule,
    AuthModule,
    // MemberModule,
    // RoleModule,
    TenantModule,
    // UserModule,
    // VerificationTokenModule,
    // SearchModule,
    // InviteModule,
    // DatabaseModule,
    // StorageModule,
    // KnowledgeModule,
    // DatabaseModule,
    // VectorModule,
    // TagModule,
    // FolderModule,
    // SourceModule,
    // ChatModule,
    // MessageModule,
    // PluginModule,
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        username: env.REDIS_USER,
        password: env.REDIS_PASSWORD,
        db: env.REDIS_DB
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { [env.BULL_BOARD_USER]: env.BULL_BOARD_PASSWORD },
      }),
    }),
    SecurityModule,
    PluginRegistryModule.forRoot(env.PLUGINS_DIR),
    MemoryModule,
    CacheModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        saveReq: true,
        saveRes: true
      },
    }),
    PromptModule,
    ...(env.SERVE_STATIC_PATH ? [
      ServeStaticModule.forRoot({ rootPath: env.SERVE_STATIC_PATH })
    ] : []),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    }
  ]
})
export class AppModule {}
