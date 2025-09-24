import { EmbeddingsModule } from "@/infra/embeddings/embeddings.module";
import { LLMModule } from "@/infra/llm/llm.module";
import { VectorModule } from "@/infra/vector/vector.module";
import { PluginRegistryModule } from "@/plugin-registry/plugin-registry.module";
import { Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge/knowledge.module";
import { PluginModule } from "../plugin/plugin.module";

import { MemoryService } from "./memory.service";

@Module({
  providers: [MemoryService],
  imports: [VectorModule, EmbeddingsModule, KnowledgeModule, LLMModule, PluginModule, PluginRegistryModule],
  exports: [MemoryService]
})
export class MemoryModule {}
