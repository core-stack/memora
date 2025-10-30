import { z } from "zod";
import { filterSchema, orderSchema } from "./shared";

export const tenantSchema = z.object({
  id: z.uuid().optional(),

  slug: z.string().min(3),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  backgroundImage: z.string().min(1),

  disabledAt: z.date().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TenantSchema = z.infer<typeof tenantSchema>;

export const tenantFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
  }).strict().optional(),
  order: z.object({
    name: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type TenantFilterSchema = z.infer<typeof tenantFilterSchema>;

export const createTenantSchema = tenantSchema.pick({
  name: true,
  slug: true,
  description: true,
  backgroundImage: true,
});
export type CreateTenantSchema = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = createTenantSchema.partial();
export type UpdateTenantSchema = z.infer<typeof updateTenantSchema>;
