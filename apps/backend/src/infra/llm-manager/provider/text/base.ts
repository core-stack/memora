import z from "zod";

import { ProviderHealth } from "../types";

export interface GenerateParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  metadata?: Record<string, any>;
}

export interface GenerateResult {
  id: string;
  output: string;
  tokensIn: number;
  tokensOut: number;
  generationTimeMs: number;
}

export interface StreamChunk {
  delta: string;
  finishReason?: string;
}

export abstract class TextProvider {
  constructor() {
    Object.setPrototypeOf(this, TextProvider.prototype);
  }

  abstract generate(params: GenerateParams): Promise<GenerateResult>;
  abstract stream?(params: GenerateParams, onChunk: (chunk: StreamChunk) => void): Promise<void>;
  abstract iterableStream(params: GenerateParams): AsyncIterable<string>;
  abstract healthCheck?(): Promise<ProviderHealth>;
  abstract withStructuredOutput<S extends z.ZodObject<any>>(query: string, schema: S): Promise<z.infer<S>>;

  dispose(): Promise<void> {
    return Promise.resolve();
  }
}
