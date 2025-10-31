import z from 'zod';

import { sourceSchema } from '@snipet/schemas';

export const sourceEntity = sourceSchema.extend({
  tenantId: z.uuid(),
});

export type SourceEntity = z.infer<typeof sourceEntity>;

export const createSourceEntity = sourceEntity.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateSourceEntity = z.infer<typeof createSourceEntity>;

export const updateSourceEntity = createSourceEntity.partial();
export type UpdateSourceEntity = z.infer<typeof updateSourceEntity>;