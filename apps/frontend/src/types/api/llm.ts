import type { LLMFilter, CreateLLM, UpdateLLM, LLM, LLMPreset } from "@snipet/schemas"

export interface LLMRoutes {
  "/api/llm": {
    GET: {
      query: LLMFilter;
      response: LLM[];
    },
    POST: {
      body: CreateLLM;
      response: LLM;
    }
  },
  "/api/llm/presets": {
    GET: {
      response: LLMPreset[];
    },
  },
  "/api/llm/:id": {
    PUT: {
      body: UpdateLLM;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
}