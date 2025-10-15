import z from 'zod';

export const baseFragmentSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.string().transform(d => new Date(d)).or(z.date()),
  updatedAt: z.string().transform(d => new Date(d)).or(z.date()),
  metadata: z.any(),
});

export type BaseFragment = z.infer<typeof baseFragmentSchema>;
