import { DatabaseModule } from '@/infra/database/database.module';
import { DeleteKnowledgeModule } from '@/jobs/delete-knowledge/delete-knowledge.module';
import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  imports: [DatabaseModule, forwardRef(() => DeleteKnowledgeModule), AuthModule],
  exports: [KnowledgeService]
})
export class KnowledgeModule {}
