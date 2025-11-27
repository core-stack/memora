import { LLMLoaderService } from "./llm-loader.service";

import { OpenAITextAdapter } from "./provider/text/openai.adapter";
import { GeminiTextAdapter } from "./provider/text/gemini.adapter";

import { OpenAIEmbeddingAdapter } from "./provider/embedding/openai.adapter";
import { GeminiLLMEmbeddingAdapter } from "./provider/embedding/gemini.adapter";
import { VoyageAIEmbeddingAdapter } from "./provider/embedding/voyage.adapter";

import { LLMPreset } from "@/types/llm-preset";
import { LLMEntity } from "@/entities/llm.entity";

jest.mock("./provider/text/openai.adapter");
jest.mock("./provider/text/gemini.adapter");

jest.mock("./provider/embedding/openai.adapter");
jest.mock("./provider/embedding/gemini.adapter");
jest.mock("./provider/embedding/voyage.adapter");

describe("LLMLoaderService", () => {
  let service: LLMLoaderService;

  const llmMock: LLMEntity = {
    config: { llmKey: "123", override: true }
  } as any;

  beforeEach(() => {
    service = new LLMLoaderService();

    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // load()
  // ---------------------------------------------------------------------------

  describe("load()", () => {
    it("should load TEXT provider", async () => {
      const preset: LLMPreset = {
        adapter: "openai",
        config: { type: "TEXT", m1: "x" } as any
      } as any;

      await service.load(llmMock, preset);

      expect(OpenAITextAdapter).toHaveBeenCalledWith(
        { type: "TEXT", m1: "x", llmKey: "123", override: true },
        preset
      );
    });

    it("should load EMBEDDING provider", async () => {
      const preset: LLMPreset = {
        adapter: "openai",
        config: { type: "EMBEDDING", dim: 768 } as any
      } as any;

      await service.load(llmMock, preset);

      expect(OpenAIEmbeddingAdapter).toHaveBeenCalledWith(
        { type: "EMBEDDING", dim: 768, llmKey: "123", override: true },
        preset
      );
    });
  });

  // ---------------------------------------------------------------------------
  // textProviderLoader()
  // ---------------------------------------------------------------------------

  describe("textProviderLoader()", () => {
    const presetText: LLMPreset = {
      adapter: "openai",
      config: { type: "TEXT", a: 1 }
    } as any;

    it("instance OpenAITextAdapter when adapter=openai", () => {
      service["textProviderLoader"]("openai", llmMock, presetText);

      expect(OpenAITextAdapter).toHaveBeenCalled();
    });

    it("instance GeminiTextAdapter when adapter=gemini", () => {
      const preset: LLMPreset = {
        adapter: "gemini",
        config: { type: "TEXT", a: 1 }
      } as any;

      service["textProviderLoader"]("gemini", llmMock, preset);

      expect(GeminiTextAdapter).toHaveBeenCalled();
    });

    it("fallback to OpenAITextAdapter in case of unknown adapter", () => {
      service["textProviderLoader"]("unknown", llmMock, presetText);

      expect(OpenAITextAdapter).toHaveBeenCalled();
    });

    it("throws error if type is not TEXT", () => {
      const wrongPreset = {
        adapter: "openai",
        config: { type: "EMBEDDING" }
      } as any;

      expect(() =>
        service["textProviderLoader"]("openai", llmMock, wrongPreset)
      ).toThrow("Invalid provider type");
    });
  });

  // ---------------------------------------------------------------------------
  // embeddingProviderLoader()
  // ---------------------------------------------------------------------------

  describe("embeddingProviderLoader()", () => {
    const presetEmb: LLMPreset = {
      adapter: "openai",
      config: { type: "EMBEDDING", dim: 128 }
    } as any;

    it("instance OpenAIEmbeddingAdapter to adapter=openai", () => {
      service["embeddingProviderLoader"]("openai", llmMock, presetEmb);

      expect(OpenAIEmbeddingAdapter).toHaveBeenCalled();
    });

    it("instance GeminiLLMEmbeddingAdapter to adapter=gemini", () => {
      const preset = {
        adapter: "gemini",
        config: { type: "EMBEDDING" }
      } as any;

      service["embeddingProviderLoader"]("gemini", llmMock, preset);

      expect(GeminiLLMEmbeddingAdapter).toHaveBeenCalled();
    });

    it("instance VoyageAIEmbeddingAdapter to adapter=voyage", () => {
      const preset = {
        adapter: "voyage",
        config: { type: "EMBEDDING" }
      } as any;

      service["embeddingProviderLoader"]("voyage", llmMock, preset);

      expect(VoyageAIEmbeddingAdapter).toHaveBeenCalled();
    });

    it("fallback to OpenAIEmbeddingAdapter in case of unknown adapter", () => {
      service["embeddingProviderLoader"]("unknown", llmMock, presetEmb);

      expect(OpenAIEmbeddingAdapter).toHaveBeenCalled();
    });

    it("throws error if type is not EMBEDDING", () => {
      const wrongPreset = {
        adapter: "openai",
        config: { type: "TEXT" }
      } as any;

      expect(() =>
        service["embeddingProviderLoader"]("openai", llmMock, wrongPreset)
      ).toThrow("Invalid provider type");
    });
  });
});
