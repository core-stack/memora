import z from 'zod';

import {
  createKnowledgeSchema, knowledgeSchema, updateKnowledgeSchema
} from '@snipet/schemas';

export const knowledgeEntity = knowledgeSchema
export type KnowledgeEntity = z.infer<typeof knowledgeEntity>;

export const createKnowledgeEntity = createKnowledgeSchema.extend({
  tenantId: z.uuid()
});
export type CreateKnowledgeEntity = z.infer<typeof createKnowledgeEntity>;

export const updateKnowledgeEntity = updateKnowledgeSchema.extend({
  tenantId: z.uuid().optional(),
});
export type UpdateKnowledgeEntity = z.infer<typeof updateKnowledgeEntity>;