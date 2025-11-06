import { z } from 'zod';

import { roleSchema } from './role';
import { filterSchema, orderSchema } from './shared';
import { tenantSchema } from './tenant';
import { userSchema } from './user';

export const memberSchema = z.object({
  id: z.uuid(),

  userId: z.uuid(),
  tenantId: z.uuid(),
  roleId: z.uuid().nullable().optional(),
  owner: z.boolean(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  user: z.lazy(() => userSchema).optional(),
  tenant: z.lazy(() => tenantSchema).optional(),
  role: z.lazy(() => roleSchema).optional(),
});

export type MemberSchema = z.infer<typeof memberSchema>;

export const memberFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().optional(),
    userId: z.uuid().optional(),
    tenantId: z.uuid().optional(),
    roleId: z.uuid().optional(),
  }).strict().optional(),
  order: z.object({
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type MemberFilterSchema = z.infer<typeof memberFilterSchema>;
