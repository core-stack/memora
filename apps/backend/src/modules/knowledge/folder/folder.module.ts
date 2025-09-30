import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge.module';
import { FolderController } from './folder.controller';
import { FolderRepository } from './folder.repository';
import { FolderService } from './folder.service';

@Module({
  controllers: [FolderController],
  providers: [FolderService, FolderRepository],
  imports: [DatabaseModule, KnowledgeModule],
  exports: [FolderService]
})
export class FolderModule {}
