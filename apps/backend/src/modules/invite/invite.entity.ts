import z from 'zod';

import { inviteSchema } from '@snipet/schemas';

export const inviteEntity = inviteSchema;
export type InviteEntity = z.infer<typeof inviteEntity>;

export const createInviteEntity = inviteEntity.omit({
  id: true,
  createdAt: true,
});
export type CreateInviteEntity = z.infer<typeof createInviteEntity>;