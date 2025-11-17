import { DatabaseModule } from '@/infra/database/database.module';
import { HTTPContextModule } from '@/shared/http-context/http-context.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge.module';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [DatabaseModule, KnowledgeModule, HTTPContextModule],
  exports: [FolderService]
})
export class FolderModule {}
