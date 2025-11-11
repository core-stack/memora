import { LLMPreset } from '@snipet/schemas';

export abstract class EmbeddingProvider {
  constructor(public preset: LLMPreset) {}

  abstract embed(text: string): Promise<number[]>;
  abstract embed(texts: string[]): Promise<number[][]>;

  dispose(): Promise<void> {
    return Promise.resolve();
  }
}