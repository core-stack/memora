import z from 'zod';

export const idSchema = z.string().uuid();
export type Id = z.infer<typeof idSchema>;

export const orderSchema = z.enum(["ASC", "DESC"]).optional();
export type Order = z.infer<typeof orderSchema>;

export const filterSchema = z.object({
  limit: z.number().int().min(1).max(2000).default(100).optional(),
  offset: z.number().int().min(0).default(0).optional(),
});

export const getFileUrlResponseSchema = z.object({
  url: z.string().url(),
  key: z.string(),
})
export type GetFileUrlResponse = z.infer<typeof getFileUrlResponseSchema>;