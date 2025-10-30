import { createTenantSchema, tagSchema, tenantSchema, updateTenantSchema } from "@snipet/schemas";
import z from "zod";

export const tenantEntity = tenantSchema;
export type TenantEntity = z.infer<typeof tenantEntity>;

export const createTenantEntity = createTenantSchema;
export type CreateTenantEntity = z.infer<typeof createTenantEntity>;

export const updateTenantEntity = updateTenantSchema;
export type UpdateTenantEntity = z.infer<typeof updateTenantEntity>;