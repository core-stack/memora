import z from 'zod';

import { sourceSchema } from '@snipet/schemas';

export const sourceEntity = sourceSchema;
export type SourceEntity = z.infer<typeof sourceEntity>;

export const createSourceEntity = sourceEntity.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateSourceEntity = z.infer<typeof createSourceEntity>;

export const updateSourceEntity = createSourceEntity.partial();
export type UpdateSourceEntity = z.infer<typeof updateSourceEntity>;