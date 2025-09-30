import z from 'zod';

export const recentSchema = z.object({
  text: z.string(),
  count: z.number().int().min(1),
  lastUsed: z.date()
});

export type Recent = z.infer<typeof recentSchema>;