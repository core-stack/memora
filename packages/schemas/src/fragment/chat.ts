import z from 'zod';

import { messageRoleSchema } from '../message';
import { baseFragmentSchema } from './base';

export const chatFragmentSchema = baseFragmentSchema.extend({
  role: messageRoleSchema,
  chatId: z.uuid(),
  knowledgeId: z.uuid(),
  tenantId: z.uuid(),
  metadata: z.object({})
});

export type ChatFragment = z.infer<typeof chatFragmentSchema>;
