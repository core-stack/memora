import { LLMEntity } from "@/entities/llm.entity";
import { Injectable } from "@nestjs/common";
import { LLMPreset } from "@/types/llm-preset";

import { EmbeddingProvider } from "./provider/embedding/base";
import { GeminiLLMEmbeddingAdapter } from "./provider/embedding/gemini.adapter";
import { OpenAIEmbeddingAdapter } from "./provider/embedding/openai.adapter";
import { TextProvider } from "./provider/text/base";
import { GeminiTextAdapter } from "./provider/text/gemini.adapter";
import { OpenAITextAdapter } from "./provider/text/openai.adapter";
import { VoyageAIEmbeddingAdapter } from "./provider/embedding/voyage.adapter";

@Injectable()
export class LLMLoaderService {
  async load<T extends TextProvider | EmbeddingProvider>(
    llm: LLMEntity,
    preset: LLMPreset
  ): Promise<T> {
    const adapter = preset.adapter;
    const type = preset.config.type;

    if (type === "TEXT") return this.textProviderLoader(adapter, llm, preset) as T;
    return this.embeddingProviderLoader(adapter, llm, preset) as T;
  }

  private textProviderLoader(
    adapter: string,
    llm: LLMEntity,
    preset: LLMPreset
  ): TextProvider {
    if (preset.config.type !== "TEXT") throw new Error("Invalid provider type");
    let AdapterClass: new (config: any, preset: LLMPreset) => TextProvider;

    switch (adapter) {
      case "openai":
        AdapterClass = OpenAITextAdapter;
        break;
      case "gemini":
        AdapterClass = GeminiTextAdapter;
        break;
      default:
        AdapterClass = OpenAITextAdapter;
        break;
    }

    return new AdapterClass({ ...preset.config, ...llm.config }, preset);
  }

  private embeddingProviderLoader(
    adapter: string,
    llm: LLMEntity,
    preset: LLMPreset
  ): { embed: (text: string) => Promise<number[]> } {
    if (preset.config.type !== "EMBEDDING") throw new Error("Invalid provider type");

    let AdapterClass: new (config: any, preset: LLMPreset) => EmbeddingProvider;
    switch (adapter) {
      case "openai":
        AdapterClass = OpenAIEmbeddingAdapter;
        break;
      case "gemini":
        AdapterClass = GeminiLLMEmbeddingAdapter;
        break;
      case "voyage":
        AdapterClass = VoyageAIEmbeddingAdapter;
        break;
      default:
        AdapterClass = OpenAIEmbeddingAdapter;
        break;
    }

    return new AdapterClass({ ...preset.config, ...llm.config } as any, preset);
  }
}
