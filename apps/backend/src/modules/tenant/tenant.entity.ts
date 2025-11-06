import z from 'zod';

import { roleSchema } from '@snipet/permission';
import { createTenantSchema, tenantSchema, updateTenantSchema } from '@snipet/schemas';

export const tenantEntity = tenantSchema;
export type TenantEntity = z.infer<typeof tenantEntity>;

export const createTenantEntity = createTenantSchema.extend({
  userId: z.uuid(),
  defaultRoles: roleSchema.array()
});
export type CreateTenantEntity = z.infer<typeof createTenantEntity>;

export const updateTenantEntity = updateTenantSchema;
export type UpdateTenantEntity = z.infer<typeof updateTenantEntity>;