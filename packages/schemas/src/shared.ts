import z from "zod";

export const idSchema = z.string().uuid();
export type Id = z.infer<typeof idSchema>;

export const orderSchema = z.enum(["ASC", "DESC"]).optional();
export type Order = z.infer<typeof orderSchema>;

export const filterSchema = z.object({
  filter: z.record(z.any(), z.any()),
  limit: z.number().int().min(1).max(2000).default(100),
  offset: z.number().int().min(0).default(0),
});