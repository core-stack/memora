import z from 'zod';

import { createLLMSchema, llmSchema } from '@snipet/schemas';

export const llmEntity = llmSchema.extend({
  config: z.record(z.string(), z.string()),
});
export type LLMEntity = z.infer<typeof llmEntity>;

export const createLLMEntity = createLLMSchema;
export type CreateLLMEntity = z.infer<typeof createLLMEntity>;

export const updateLLMEntity = createLLMSchema;
export type UpdateLLMEntity = z.infer<typeof updateLLMEntity>;