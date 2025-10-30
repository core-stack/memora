import { Injectable } from '@nestjs/common';
import { LLMPreset } from '@snipet/schemas';

import { LLMEntity } from './llm.schema';
import { EmbeddingProvider } from './provider/embedding/base';
import { OpenAILLMEmbeddingAdapter } from './provider/embedding/openai.adapter';
import { TextProvider } from './provider/text/base';
import { GeminiTextAdapter } from './provider/text/gemini.adapter';
import { OpenAILLMTextAdapter } from './provider/text/openai.adapter';

@Injectable()
export class LLMLoaderService<T extends TextProvider | EmbeddingProvider> {
  async load(llm: LLMEntity, preset: LLMPreset): Promise<T> {
    const adapter = preset.adapter;
    const type = preset.config.type;

    if (type === "TEXT") return this.textProviderLoader(adapter, llm, preset) as T;
    return this.embeddingProviderLoader(adapter, llm, preset) as T;
  }

  private textProviderLoader(adapter: string, llm: LLMEntity, preset: LLMPreset): TextProvider {
    if (preset.config.type !== "TEXT") throw new Error("Invalid provider type");
    let AdapterClass: new (config: any) => TextProvider;

    switch(adapter) {
      case "openai":
        AdapterClass = OpenAILLMTextAdapter;
        break;
      case "gemini":
        AdapterClass = GeminiTextAdapter;
        break;
      default:
        AdapterClass = OpenAILLMTextAdapter;
        break;
    }

    return new AdapterClass({ ...preset.config, ...llm.config });
  }

  private embeddingProviderLoader(adapter: string, llm: LLMEntity, preset: LLMPreset) {
    if (preset.config.type !== "EMBEDDING") throw new Error("Invalid provider type");

    let AdapterClass: new (config: any) => EmbeddingProvider;

    switch(adapter) {
      case "openai":
        AdapterClass = OpenAILLMEmbeddingAdapter;
        break;
      default:
        AdapterClass = OpenAILLMEmbeddingAdapter;
        break;
    }

    return new AdapterClass({ ...preset.config, ...llm.config });
  }
}