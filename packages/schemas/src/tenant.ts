import { z } from "zod";

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
