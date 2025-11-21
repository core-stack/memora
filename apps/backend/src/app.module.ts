import basicAuth from "express-basic-auth";
import { ClsModule } from "nestjs-cls";

import { ExpressAdapter } from "@bull-board/express";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";

import { env } from "./env";
import { AuthGuard } from "./guards/auth.guard";
import { DatabaseModule } from "./infra/database/database.module";
import { LLMManagerModule } from "./infra/llm-manager/llm-manager.module";
import { PromptModule } from "./infra/prompt/prompt.module";
import { SecurityModule } from "./infra/security/security.module";
import { StorageModule } from "./infra/storage/storage.module";
import { VectorModule } from "./infra/vector/vector.module";
import { DeleteKnowledgeModule } from "./jobs/delete-knowledge/delete-knowledge.module";
import { EmailModule } from "./jobs/email/email.module";
import { IngestModule } from "./jobs/ingest/ingest.module";
import { AccountModule } from "./modules/account/account.module";
import { AuthModule } from "./modules/auth/auth.module";
import { InviteModule } from "./modules/invite/invite.module";
import { ChatModule } from "./modules/knowledge/chat/chat.module";
import { MessageModule } from "./modules/knowledge/chat/message/message.module";
import { FolderModule } from "./modules/knowledge/folder/folder.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { SearchModule } from "./modules/knowledge/search/search.module";
import { SourceModule } from "./modules/knowledge/source/source.module";
import { MemberModule } from "./modules/member/member.module";
import { ChatMemoryModule } from "./modules/memory/chat-memory/chat-memory.module";
import { SourceMemoryModule } from "./modules/memory/source-memory/source-memory.module";
import { RoleModule } from "./modules/role/role.module";
import { TenantModule } from "./modules/tenant/tenant.module";
import { UserModule } from "./modules/user/user.module";
import { VerificationTokenModule } from "./modules/verification-token/verification-token.module";
import { HTTPContextModule } from "./shared/http-context/http-context.module";
import { ContextInterceptor } from "./shared/interceptor/context";

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    FolderModule,
    SourceModule,
    ChatModule,
    MessageModule,
    HTTPContextModule,
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        username: env.REDIS_USER,
        password: env.REDIS_PASSWORD,
        db: env.REDIS_DB
      }
    }),
    BullBoardModule.forRoot({
      route: "/queues",
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { [env.BULL_BOARD_USER]: env.BULL_BOARD_PASSWORD }
      })
    }),
    SecurityModule,
    SourceMemoryModule,
    ChatMemoryModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        saveReq: true,
        saveRes: true
      }
    }),
    PromptModule,
    ...(env.SERVE_STATIC_PATH ? [
      ServeStaticModule.forRoot({ rootPath: env.SERVE_STATIC_PATH })
    ] : [])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor
    }
  ]
})
export class AppModule {}
