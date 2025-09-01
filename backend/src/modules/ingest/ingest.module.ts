import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Module } from "@nestjs/common";

import { env } from "src/env";
import { DatabaseModule } from "src/services/database/database.module";
import { PrismaModule } from "src/services/prisma/prisma.module";
import { StorageModule } from "src/services/storage/storage.module";

import { IngestController } from "./ingest.controller";
import { IngestService } from "./ingest.service";
import { PDFProcessor } from "./processors/pdf.processor";

@Module({
  controllers: [IngestController],
  providers: [IngestService, PDFProcessor, {
    provide: Embeddings,
    useFactory: () => new GoogleGenerativeAIEmbeddings({ apiKey: env.GEMINI_API_KEY }),
  }],
  imports: [DatabaseModule, StorageModule, PrismaModule]
})
export class IngestModule {}
