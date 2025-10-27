import z from 'zod';

import {
  createKnowledgeSchema, knowledgeSchema, knowledgeStatusEnum, updateKnowledgeSchema
} from '@snipet/schemas';

export const knowledge = knowledgeSchema
export type Knowledge = z.infer<typeof knowledge>;

export const createKnowledge = createKnowledgeSchema.extend({
  tenantId: z.uuid()
});
export type CreateKnowledge = z.infer<typeof createKnowledge>;

export const updateKnowledge = updateKnowledgeSchema.extend({
  tenantId: z.uuid().optional(),
});
export type UpdateKnowledge = z.infer<typeof updateKnowledge>;