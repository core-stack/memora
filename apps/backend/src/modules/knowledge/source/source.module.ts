import { DatabaseModule } from '@/infra/database/database.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { IngestModule } from '@/jobs/ingest/ingest.module';
import { forwardRef, Module } from '@nestjs/common';

import { FolderModule } from '../folder/folder.module';
import { KnowledgeModule } from '../knowledge.module';
import { SourceController } from './source.controller';
import { SourceRepository } from './source.repository';
import { SourceService } from './source.service';

@Module({
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  imports: [FolderModule, DatabaseModule, KnowledgeModule, StorageModule.register(), forwardRef(() => IngestModule)],
  exports: [SourceService, SourceRepository],
})
export class SourceModule {}
