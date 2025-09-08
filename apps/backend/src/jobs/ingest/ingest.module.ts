import { env } from "@/env";
import { StorageModule } from "@/infra/storage/storage.module";
import { VectorModule } from "@/infra/vector/vector.module";
import { SourceModule } from "@/modules/knowledge/source/source.module";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { BullBoardModule } from "@bull-board/nestjs";
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { BullModule } from "@nestjs/bullmq";
import { forwardRef, Module } from "@nestjs/common";

import { IngestProcessor } from "./ingest.processor";
import { PDFProcessor } from "./processors/pdf.processor";

@Module({
  providers: [IngestProcessor, PDFProcessor, {
    provide: Embeddings,
    useFactory: () => new GoogleGenerativeAIEmbeddings({ apiKey: env.GEMINI_API_KEY }),
  }],
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
