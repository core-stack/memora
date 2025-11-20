import z from 'zod';

import { filterSchema, orderSchema } from './shared';

export const llmTypeSchema = z.enum(["EMBEDDING", "TEXT"]);
export type LLMType = z.infer<typeof llmTypeSchema>;

export const llmSchema = z.object({
  id: z.uuid(),

  name: z.string().max(255),

  model: z.string().max(255),
  type: llmTypeSchema,

  tenantId: z.uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LLM = z.infer<typeof llmSchema>;

export const llmFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().optional(),
    name: z.string().optional(),
    tenantId: z.uuid().optional(),
    type: llmTypeSchema.optional(),
  }).strict().optional(),
  order: z.object({
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type LLMFilter = z.infer<typeof llmFilterSchema>;

export const createLLMSchema = llmSchema.pick({ name: true, type: true, model: true }).extend({
  config: z.record(z.string(), z.any()),
});
export type CreateLLM = z.infer<typeof createLLMSchema>;

export const updateLLMSchema = llmSchema.pick({ name: true }).extend({
  config: z.record(z.string(), z.any()),
});
export type UpdateLLM = z.infer<typeof updateLLMSchema>;

export const presetFieldTypeSchema = z.enum(["string", "secret-string"]);


export const textLLMConfigSchema = z.object({
  type: z.literal("TEXT"),
  model: z.string(),
});

export const embeddingLLMConfigSchema = z.object({
  type: z.literal("EMBEDDING"),
  model: z.string(),
  dimension: z.number()
});

//#region OpenAI Adapter
export const openAiTextLLMConfigSchema = textLLMConfigSchema.extend({
  baseUrl: z.url(),
  // apiKey: z.string()
})
export const openAiEmbeddingLLMConfigSchema = embeddingLLMConfigSchema.extend({
  baseUrl: z.url(),
  // apiKey: z.string()
})
//#endregion

//#region Gemini Adapter
export const geminiTextLLMConfigSchema = textLLMConfigSchema.extend({
  // apiKey: z.string()
})
export const geminiEmbeddingLLMConfigSchema = embeddingLLMConfigSchema.extend({
  // apiKey: z.string()
})
//#endregion

export const baseLLMPresetSchema = z.object({
  name: z.string(),
  description: z.string(),
  iconPath: z.string(),
  fields: z.record(z.string(), presetFieldTypeSchema).optional(),
  defaults: z.record(z.string(), z.any()).optional(),
  required: z.array(z.string()).optional()
});

export const llmPresetSchema = z.discriminatedUnion("adapter", [
  baseLLMPresetSchema.extend({
    adapter: z.literal("openai"),
    config: z.union([openAiTextLLMConfigSchema, openAiEmbeddingLLMConfigSchema])
  }),
  baseLLMPresetSchema.extend({
    adapter: z.literal("gemini"),
    config: z.union([geminiTextLLMConfigSchema, geminiEmbeddingLLMConfigSchema])
  })
]);

export type LLMPreset = z.infer<typeof llmPresetSchema>;