import { LLMPreset } from "@/types/llm-preset";

export abstract class EmbeddingProvider {
  constructor(public preset: LLMPreset) {}

  abstract embed(text: string): Promise<number[]>;
  abstract embed(texts: string[]): Promise<number[][]>;

  dispose(): Promise<void> {
    return Promise.resolve();
  }
}
