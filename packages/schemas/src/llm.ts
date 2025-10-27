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
  baseUrl: z.string().optional(),
});

export const embeddingLLMConfigSchema = z.object({
  type: z.literal("EMBEDDING"),
  model: z.string(),
  baseUrl: z.string().optional(),
  dimension: z.number()
});

export const llmPresetSchema = z.object({
  name: z.string(),
  description: z.string(),
  iconPath: z.string(),
  fields: z.record(z.string(), presetFieldTypeSchema).optional(),
  defaults: z.record(z.string(), z.any()).optional(),
  required: z.array(z.string()).optional(),
  config: z.union([textLLMConfigSchema, embeddingLLMConfigSchema]),
});

export type LLMPreset = z.infer<typeof llmPresetSchema>;