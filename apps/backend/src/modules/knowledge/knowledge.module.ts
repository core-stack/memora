import { RepositoryModule } from '@/services/repository/repository.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { FolderModule } from './folder/folder.module';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeRepository } from './knowledge.repository';
import { KnowledgeService } from './knowledge.service';
import { SourceModule } from './source/source.module';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, KnowledgeRepository],
  imports: [
    FolderModule,
    SourceModule,
    RepositoryModule,
    RouterModule.register([
      {
        path: "knowledge/:knowledge_slug",
        children: [
          { path: "", module: FolderModule },
          { path: "", module: SourceModule }
        ]
      }
    ])
  ]
})
export class KnowledgeModule {}
