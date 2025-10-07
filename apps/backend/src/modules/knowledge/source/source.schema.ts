import z from 'zod';

import { createSourceSchema, indexStatusSchema, updateSourceSchema } from '@memora/schemas';

export const createSource = createSourceSchema.extend({
  tenantId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  indexStatus: indexStatusSchema,
});
export type CreateSource = z.infer<typeof createSource>;

export const updateSource = updateSourceSchema.extend({
  tenantId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  indexStatus: indexStatusSchema,
});
export type UpdateSource = z.infer<typeof updateSource>;