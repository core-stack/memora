import z from 'zod';

import { messageRoleSchema } from '../message';
import { baseFragmentSchema } from './base';

export const chatFragmentSchema = baseFragmentSchema.extend({
  role: messageRoleSchema,
  chatId: z.string().uuid(),
  seqId: z.number(),
  knowledgeId: z.string().uuid(),
  tenantId: z.string().uuid(),
  metadata: z.object({
    
  })
});

export type ChatFragment = z.infer<typeof chatFragmentSchema>;
