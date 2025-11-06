import { z } from 'zod';

import { filterSchema, orderSchema } from './shared';

export const inviteSchema = z.object({
  id: z.uuid().optional(),
  email: z.email(),
  role: z.string().optional(),
  token: z.string().min(1),
  accepted: z.boolean().default(false),

  tenantId: z.uuid(),
  invitedById: z.uuid().nullable().optional(),
  memberId: z.uuid().nullable().optional(),

  createdAt: z.date().optional(),
  expiresAt: z.date(),
});

export type InviteSchema = z.infer<typeof inviteSchema>;

export const inviteFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().nullable().optional(),
    email: z.string().optional(),
    role: z.uuid().nullable().optional(),
  }).strict().optional(),
  order: z.object({
    email: orderSchema,
    createdAt: orderSchema,
  }).strict().optional(),
}).strict();
export type InviteFilterSchema = z.infer<typeof inviteFilterSchema>;


export const createInviteSchema = inviteSchema.pick({ email: true, role: true, tenantId: true });
export type CreateInviteSchema = z.infer<typeof createInviteSchema>;