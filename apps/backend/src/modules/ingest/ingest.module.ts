import { DatabaseModule } from "@/infra/database/database.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Module } from "@nestjs/common";

import { env } from "src/env";

import { IngestController } from "./ingest.controller";
import { IngestService } from "./ingest.service";
import { PDFProcessor } from "./processors/pdf.processor";

@Module({
  controllers: [IngestController],
  providers: [IngestService, PDFProcessor, {
    provide: Embeddings,
    useFactory: () => new GoogleGenerativeAIEmbeddings({ apiKey: env.GEMINI_API_KEY }),
  }],
  imports: [DatabaseModule, StorageModule]
})
export class IngestModule {}
