import { z } from 'zod';

import { filterSchema, orderSchema } from './shared';

export const inviteSchema = z.object({
  id: z.uuid(),
  email: z.email(),

  roleId: z.uuid(),
  tenantId: z.uuid(),
  creatorId: z.uuid(),
  userId: z.uuid().nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
  expiresAt: z.date(),
});

export type InviteSchema = z.infer<typeof inviteSchema>;

export const inviteFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().nullable().optional(),
    email: z.string().optional(),
    roleId: z.uuid().nullable().optional(),
  }).strict().optional(),
  order: z.object({
    email: orderSchema,
    createdAt: orderSchema,
  }).strict().optional(),
}).strict();
export type InviteFilterSchema = z.infer<typeof inviteFilterSchema>;


export const createInviteSchema = z.object({
  emails: inviteSchema.pick({ email: true, roleId: true }).array(),
});
export type CreateInviteSchema = z.infer<typeof createInviteSchema>;