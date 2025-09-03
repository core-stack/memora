import z from 'zod';

import { createKnowledgeSchema as originalCreateKnowledgeSchema } from '@memora/schemas';

export const createKnowledgeSchema = originalCreateKnowledgeSchema.extend({
  tenantId: z.string().uuid()
});
export type CreateKnowledge = z.infer<typeof createKnowledgeSchema>;