import { DatabaseModule } from '@/infra/database/database.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { IngestModule } from '@/jobs/ingest/ingest.module';
import { forwardRef, Module } from '@nestjs/common';

import { FolderModule } from '../folder/folder.module';
import { KnowledgeModule } from '../knowledge.module';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
  controllers: [SourceController],
  providers: [SourceService],
  imports: [FolderModule, DatabaseModule, KnowledgeModule, StorageModule, forwardRef(() => IngestModule)],
  exports: [SourceService],
})
export class SourceModule {}
