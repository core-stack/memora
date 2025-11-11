import { StorageModule } from '@/infra/storage/storage.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { SourceModule } from '@/modules/knowledge/source/source.module';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';

import { JobType } from '../types';
import { IngestProcessor } from './ingest.processor';
import { ProcessorManager } from './processor-manager';
import { PDFProcessor } from './processors/pdf.processor';
import { CSVProcessor, DocxProcessor, JSONLProcessor, JSONProcessor, PPTProcessor, TextProcessor } from './processors';

@Module({
  providers: [
    IngestProcessor,
    ProcessorManager,
    CSVProcessor,
    DocxProcessor,
    JSONProcessor,
    JSONLProcessor,
    PDFProcessor,
    PPTProcessor,
    TextProcessor,
  ],
  imports: [
    VectorModule,
    StorageModule,
    forwardRef(() => SourceModule),
    BullModule.registerQueue({ name: JobType.INGEST }),
    BullBoardModule.forFeature({ name: JobType.INGEST, adapter: BullMQAdapter }),
  ],
  exports: [ BullModule ]
})
export class IngestModule {}
