import { ExpressAdapter } from "@bull-board/express";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import basicAuth from "express-basic-auth";
import { join } from "path";

import { env } from "./env";
import { DatabaseModule } from "./infra/database/database.module";
import { SecurityModule } from "./infra/security/security.module";
import { StorageModule } from "./infra/storage/storage.module";
import { VectorModule } from "./infra/vector/vector.module";
import { IngestModule } from "./jobs/ingest/ingest.module";
import { ChatModule } from "./modules/knowledge/chat/chat.module";
import { MessageModule } from "./modules/knowledge/chat/message/message.module";
import { FolderModule } from "./modules/knowledge/folder/folder.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { SearchModule } from "./modules/knowledge/search/search.module";
import { SourceModule } from "./modules/knowledge/source/source.module";
import { MemoryModule } from "./modules/memory/memory.module";
import { PluginModule } from "./modules/plugin/plugin.module";
import { TagModule } from "./modules/tag/tag.module";
import { PluginRegistryModule } from "./plugin-registry/plugin-registry.module";
import { CacheModule } from './infra/cache/cache.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend'),
      exclude: ['/api*'],
    }),
    IngestModule,
    SearchModule,
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
  ],
})
export class AppModule {}
