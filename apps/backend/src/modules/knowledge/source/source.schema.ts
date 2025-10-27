import z from 'zod';

import { createSourceSchema, indexStatusSchema, updateSourceSchema } from '@snipet/schemas';

export const createSource = createSourceSchema.extend({
  tenantId: z.uuid(),
  knowledgeId: z.uuid(),
  indexStatus: indexStatusSchema,
});
export type CreateSource = z.infer<typeof createSource>;

export const updateSource = updateSourceSchema.extend({
  tenantId: z.uuid(),
  knowledgeId: z.uuid(),
  indexStatus: indexStatusSchema,
});
export type UpdateSource = z.infer<typeof updateSource>;