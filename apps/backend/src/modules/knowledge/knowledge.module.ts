import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { KnowledgeController } from './knowledge.controller';
import { KnowledgeRepository } from './knowledge.repository';
import { KnowledgeService } from './knowledge.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, KnowledgeRepository],
  imports: [DatabaseModule],
  exports: [KnowledgeService]
})
export class KnowledgeModule {}
