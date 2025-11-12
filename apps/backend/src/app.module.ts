import basicAuth from 'express-basic-auth';

import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from "nestjs-cls";
import { env } from './env';
import { AuthGuard } from './guards/auth.guard';
import { CacheModule } from './infra/cache/cache.module';
import { DatabaseModule } from './infra/database/database.module';
import { LLMManagerModule } from './infra/llm-manager/llm-manager.module';
import { PromptModule } from './infra/prompt/prompt.module';
import { SecurityModule } from './infra/security/security.module';
import { StorageModule } from './infra/storage/storage.module';
import { VectorModule } from './infra/vector/vector.module';
import { DeleteKnowledgeModule } from './jobs/delete-knowledge/delete-knowledge.module';
import { EmailModule } from './jobs/email/email.module';
import { IngestModule } from './jobs/ingest/ingest.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { InviteModule } from './modules/invite/invite.module';
import { ChatModule } from './modules/knowledge/chat/chat.module';
import { MessageModule } from './modules/knowledge/chat/message/message.module';
import { FolderModule } from './modules/knowledge/folder/folder.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { SearchModule } from './modules/knowledge/search/search.module';
import { SourceModule } from './modules/knowledge/source/source.module';
import { LLMModule } from './modules/llm/llm.module';
import { MemberModule } from './modules/member/member.module';
import { MemoryModule } from './modules/memory/memory.module';
import { PluginModule } from './modules/plugin/plugin.module';
import { RoleModule } from './modules/role/role.module';
import { TagModule } from './modules/tag/tag.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { VerificationTokenModule } from './modules/verification-token/verification-token.module';
import { PluginRegistryModule } from './plugin-registry/plugin-registry.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LLMModule,
    LLMManagerModule,
    IngestModule,
    DeleteKnowledgeModule,
    EmailModule,
    AccountModule,
    AuthModule,
    MemberModule,
    RoleModule,
    TenantModule,
    UserModule,
    VerificationTokenModule,
    SearchModule,
    InviteModule,
    DatabaseModule,
    StorageModule,
    KnowledgeModule,
    DatabaseModule,
    VectorModule,
    TagModule,
    FolderModule,
    SourceModule,
    ChatModule,
    MessageModule,
    PluginModule,
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
    }
  ]
})
export class AppModule {}
