import z from 'zod';

import {
  createKnowledgeSchema, knowledgeSchema, knowledgeStatusEnum, updateKnowledgeSchema
} from '@snipet/schemas';

export const knowledgeEntity = knowledgeSchema
export type KnowledgeEntity = z.infer<typeof knowledgeEntity>;

export const createKnowledgeEntity = createKnowledgeSchema.extend({
  tenantId: z.uuid()
});
export type CreateKnowledgeEntity = z.infer<typeof createKnowledgeEntity>;

export const updateKnowledgeEntity = updateKnowledgeSchema.extend({
  tenantId: z.uuid().optional(),
  status: knowledgeStatusEnum,
  deleteError: z.string().optional()
});
export type UpdateKnowledgeEntity = z.infer<typeof updateKnowledgeEntity>;