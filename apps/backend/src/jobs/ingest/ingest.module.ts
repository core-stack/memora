import { env } from "@/env";
import { StorageModule } from "@/infra/storage/storage.module";
import { VectorModule } from "@/infra/vector/vector.module";
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { IngestService } from "./ingest.service";
import { PDFProcessor } from "./processors/pdf.processor";

@Module({
  providers: [IngestService, PDFProcessor, {
    provide: Embeddings,
    useFactory: () => new GoogleGenerativeAIEmbeddings({ apiKey: env.GEMINI_API_KEY }),
  }],
  imports: [ VectorModule, StorageModule, BullModule.registerQueue({ name: "ingest" }) ],
  exports: [ BullModule ]
})
export class IngestModule {}
