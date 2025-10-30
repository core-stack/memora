import { randomUUID } from 'crypto';

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

import { ProviderHealth } from '../types';
import { GenerateParams, GenerateResult, StreamChunk, TextProvider } from './base';

type GeminiAdapterOptions = {
  apiKey: string;
  model: string;
}
export class GeminiTextAdapter extends TextProvider {
  private model: GenerativeModel;
  private client: GoogleGenerativeAI;
  constructor(opts: GeminiAdapterOptions) {
    super();
    this.client = new GoogleGenerativeAI(opts.apiKey);
    this.model = this.client.getGenerativeModel({ model: opts.model });
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const { prompt, maxTokens, temperature } = params;
    const start = Date.now();
    const res = await this.model.generateContent({ 
      contents: [{ 
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    });

    return {
      id: randomUUID(),
      output: res.response.text(),
      tokensIn: res.response.usageMetadata?.promptTokenCount ?? 0,
      tokensOut: res.response.usageMetadata?.candidatesTokenCount ?? 0,
      generationTimeMs: Date.now() - start
    }
  }
  
  async stream(params: GenerateParams, onChunk: (chunk: StreamChunk) => void): Promise<void> {
    const { prompt, maxTokens, temperature } = params;
    const start = Date.now();
    const res = await this.model.generateContentStream({ 
      contents: [{ 
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    });
    for await (const chunk of res.stream) {
      const chunkText = chunk.text();
      onChunk({ delta: chunkText });
    }
    onChunk({ delta: "", finishReason: "stop" });
  }
  
  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      const res = await this.model.countTokens("ping");
      return { ok: true, latencyMs: Date.now() - start };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}