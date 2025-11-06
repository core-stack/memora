import z from 'zod';

import { createInviteSchema, inviteSchema } from '@snipet/schemas';

export const inviteEntity = inviteSchema;
export type InviteEntity = z.infer<typeof inviteEntity>;

export const createInviteEntity = createInviteSchema;
export type CreateInviteEntity = z.infer<typeof createInviteEntity>;