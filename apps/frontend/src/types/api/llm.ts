import type { LLMFilter, CreateLLM, UpdateLLM, LLM, LLMPreset } from "@snipet/schemas"

export interface LLMRoutes {
  "/api/tenant/:tenantId/llm": {
    GET: {
      query: LLMFilter;
      params: { tenantId: string };
      response: LLM[];
    },
    POST: {
      body: CreateLLM;
      params: { tenantId: string };
      response: LLM;
    }
  },
  "/api/tenant/:tenantId/llm/presets": {
    GET: {
      params: { tenantId: string };
      response: LLMPreset[];
    },
  },
  "/api/tenant/:tenantId/llm/:id": {
    PUT: {
      body: UpdateLLM;
      params: Partial<{ tenantId: string, id: string }>;
      response: undefined;
    },
    DELETE: {
      params: Partial<{ tenantId: string, id: string }>;
      response: undefined;
    }
  },
}