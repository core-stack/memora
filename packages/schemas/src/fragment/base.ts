import z from 'zod';

export const baseFragmentSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.any(),
});

export type BaseFragment = z.infer<typeof baseFragmentSchema>;
