import OpenAI from 'openai';

import { ProviderHealth } from '../types';
import { GenerateParams, GenerateResult, StreamChunk, TextProvider } from './base';

type OpenAIOptions = {
  baseURL: string;
  apiKey: string;
  model: string;
}

export class OpenAILLMTextAdapter extends TextProvider {
  client: OpenAI;

  constructor(private opts: OpenAIOptions) {
    super();
    this.client = new OpenAI({ baseURL: opts.baseURL, apiKey: opts.apiKey });
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const { prompt, maxTokens, temperature } = params;
    const start = Date.now();

    const response = await this.client.chat.completions.create({
      model: this.opts.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
      stream: false,
    });

    const message = response.choices[0]?.message?.content ?? "";
    const tokensIn = response.usage?.prompt_tokens ?? 0;
    const tokensOut = response.usage?.completion_tokens ?? 0;

    return {
      id: response.id,
      output: message,
      tokensIn,
      tokensOut,
      generationTimeMs: Date.now() - start
    };
  }

  async stream(params: GenerateParams, onChunk: (chunk: StreamChunk) => void): Promise<void> {
    const { prompt, maxTokens, temperature } = params;
    const stream = await this.client.chat.completions.create({
      model: this.opts.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    });

    for await (const part of stream) {
      const delta = part.choices[0]?.delta?.content;
      if (delta) {
        onChunk({ delta });
      }
      if (part.choices[0]?.finish_reason) {
        onChunk({ delta: "", finishReason: part.choices[0].finish_reason });
      }
    }
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