import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ContextInterceptor } from './infra/context/context.interceptor';
import { ContextModule } from './infra/context/context.module';
import { DatabaseModule } from './infra/database/database.module';
import { StorageModule } from './infra/storage/storage.module';
import { VectorModule } from './infra/vector/vector.module';
import { IngestModule } from './modules/ingest/ingest.module';
import { FolderModule } from './modules/knowledge/folder/folder.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { SourceModule } from './modules/knowledge/source/source.module';
import { SearchModule } from './modules/search/search.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
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
    ContextModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor
    }
  ]
})
export class AppModule {}
