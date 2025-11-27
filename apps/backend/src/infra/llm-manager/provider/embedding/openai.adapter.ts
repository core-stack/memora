import OpenAI from "openai";

import { LLMPreset } from "@/types/llm-preset";

import { ProviderHealth } from "../types";
import { EmbeddingProvider } from "./base";

type OpenAIOptions = {
  baseURL: string;
  apiKey: string;
  model: string;
}

export class OpenAIEmbeddingAdapter extends EmbeddingProvider {
  client: OpenAI;

  constructor(private opts: OpenAIOptions, preset: LLMPreset) {
    super(preset);
    this.client = new OpenAI({ baseURL: opts.baseURL, apiKey: opts.apiKey });
  }

  embed(text: string): Promise<number[]>;
  embed(texts: string[]): Promise<number[][]>;
  async embed(texts: string | string[]): Promise<number[] | number[][]> {
    const response = await this.client.embeddings.create({
      model: this.opts.model,
      input: texts
    });
    if (Array.isArray(texts)) return response.data.map((d) => d.embedding);
    return response.data[0].embedding;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.client.models.list();
      return { ok: true, latencyMs: Date.now() - start };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }
}
