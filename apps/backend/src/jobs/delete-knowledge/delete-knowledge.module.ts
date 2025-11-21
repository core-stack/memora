import { StorageModule } from "@/infra/storage/storage.module";
import { VectorModule } from "@/infra/vector/vector.module";
import { KnowledgeModule } from "@/modules/knowledge/knowledge.module";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { forwardRef, Module } from "@nestjs/common";

import { JobType } from "../types";
import { DeleteKnowledgeProcessor } from "./delete-knowledge.processor";

@Module({
  providers: [ DeleteKnowledgeProcessor ],
  imports: [
    forwardRef(() => KnowledgeModule),
    BullModule.registerQueue({ name: JobType.DELETE_KNOWLEDGE }),
    BullBoardModule.forFeature({ name: JobType.DELETE_KNOWLEDGE, adapter: BullMQAdapter }),
    StorageModule,
    VectorModule
  ],
  exports: [ BullModule ]
})
export class DeleteKnowledgeModule {}
