import { VoyageAIClient } from "voyageai";
import { LLMPreset } from "@/types/llm-preset";
import { ProviderHealth } from "../types";
import { EmbeddingProvider } from "./base";
import { EmbedError } from "../../errors/embed.error";

type VoyageOptions = {
  apiKey: string;
  model: string;
};

export class VoyageAIEmbeddingAdapter extends EmbeddingProvider {
  client: VoyageAIClient;

  constructor(private opts: VoyageOptions, preset: LLMPreset) {
    super(preset);
    this.client = new VoyageAIClient({ apiKey: opts.apiKey });
  }

  embed(text: string): Promise<number[]>;
  embed(texts: string[]): Promise<number[][]>;
  async embed(texts: string | string[]): Promise<number[] | number[][]> {
    try {
      const response = await this.client.embed({
        model: this.opts.model,
        input: texts
      });

      if (!response.data) {
        throw new EmbedError("No embeddings found");
      }

      const embeddings = response.data.map((d) => d.embedding);
      if (embeddings.some((e) => !e)) {
        throw new EmbedError("Some embeddings not found");
      }
      return Array.isArray(texts) ? embeddings as number[][] : embeddings[0] as number[];
    } catch (error) {
      throw new EmbedError(error.message, { cause: error });
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();

    try {
      // Voyage não tem equivalente direto a "models.list()",
      // então fazemos uma chamada de embed mínima como health-check.
      await this.client.embed({
        model: this.opts.model,
        input: "ping"
      });

      return { ok: true, latencyMs: Date.now() - start };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }
}
