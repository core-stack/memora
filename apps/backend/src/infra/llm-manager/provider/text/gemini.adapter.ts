import { randomUUID } from "crypto";
import { output, ZodObject } from "zod";

import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

import { ProviderHealth } from "../types";
import { GenerateParams, GenerateResult, StreamChunk, TextProvider } from "./base";

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
    this.model = this.client.getGenerativeModel({
      model: opts.model,
      tools: [ { googleSearch: {} } as any ]
    });
  }

  public async generate(params: GenerateParams): Promise<GenerateResult> {
    const { prompt, maxTokens, temperature } = params;
    const start = Date.now();
    const res = await this.model.generateContent({
      contents: [ {
        role: "user",
        parts: [ { text: prompt } ]
      } ],
      generationConfig: { temperature, maxOutputTokens: maxTokens }
    });

    return {
      id: randomUUID(),
      output: res.response.text(),
      tokensIn: res.response.usageMetadata?.promptTokenCount ?? 0,
      tokensOut: res.response.usageMetadata?.candidatesTokenCount ?? 0,
      generationTimeMs: Date.now() - start
    };
  }

  public async stream(params: GenerateParams, onChunk: (chunk: StreamChunk) => void): Promise<void> {
    const { prompt, maxTokens, temperature } = params;
    const res = await this.model.generateContentStream({
      contents: [ {
        role: "user",
        parts: [ { text: prompt } ]
      } ],
      generationConfig: { temperature, maxOutputTokens: maxTokens }
    });
    for await (const chunk of res.stream) {
      const chunkText = chunk.text();
      onChunk({ delta: chunkText });
    }
    onChunk({ delta: "", finishReason: "stop" });
  }

  public iterableStream(params: GenerateParams): AsyncIterable<string> {
    return {
      async *[Symbol.asyncIterator]() {
        const { prompt, maxTokens, temperature } = params;

        const res = await this.model.generateContentStream({
          contents: [ {
            role: "user",
            parts: [ { text: prompt } ]
          } ],
          generationConfig: { temperature, maxOutputTokens: maxTokens }
        });

        for await (const chunk of res.stream) {
          const chunkText = chunk.text();
          if (chunkText) yield chunkText;
        }
      }
    };
  }

  public async withStructuredOutput<S extends ZodObject<any>>(
    query: string,
    schema: S
  ): Promise<output<S>> {
    const jsonSchema = schema._zod.toJSONSchema?.();

    const prompt = `
      You are a helpful assistant.
      Your task is to answer a question based on the following JSON schema:

      ${JSON.stringify(jsonSchema, null, 2)}
      Note: The output must be a valid JSON object that matches the schema above.

      Here is the query:
      "${query}"
    `.trim();

    const res = await this.model.generateContent({
      contents: [ {
        role: "user",
        parts: [ { text: prompt } ]
      } ],
      generationConfig: {
        temperature: 0
      }
    });

    const text = res.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      throw new Error(`Failed to parse JSON: ${err}\nText: ${text}`);
    }

    return schema.parse(parsed);
  }


  public async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.model.countTokens("ping");
      return { ok: true, latencyMs: Date.now() - start };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
