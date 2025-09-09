import { StorageModule } from '@/infra/storage/storage.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { SourceModule } from '@/modules/knowledge/source/source.module';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';

import { IngestProcessor } from './ingest.processor';
import { PDFProcessor } from './processors/pdf.processor';

@Module({
  providers: [IngestProcessor, PDFProcessor],
  imports: [
    VectorModule,
    StorageModule,
    forwardRef(() => SourceModule),
    BullModule.registerQueue({ name: "ingest" }),
    BullBoardModule.forFeature({ name: "ingest", adapter: BullMQAdapter }),
  ],
  exports: [ BullModule ]
})
export class IngestModule {}
