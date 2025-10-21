import { DatabaseModule } from '@/infra/database/database.module';
import { DeleteKnowledgeModule } from '@/jobs/delete-knowledge/delete-knowledge.module';
import { forwardRef, Module } from '@nestjs/common';

import { KnowledgeController } from './knowledge.controller';
import { KnowledgeRepository } from './knowledge.repository';
import { KnowledgeService } from './knowledge.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, KnowledgeRepository],
  imports: [DatabaseModule, forwardRef(() => DeleteKnowledgeModule)],
  exports: [KnowledgeService, KnowledgeRepository]
})
export class KnowledgeModule {}
