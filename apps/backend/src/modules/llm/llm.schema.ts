import z from 'zod';

import { llmSchema } from '@snipet/schemas';

export const llm = llmSchema.extend({
  config: z.record(z.string(), z.string()),
});
export type LLM = z.infer<typeof llm>;