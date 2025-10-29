import { z } from "zod";

export const accountSchema = z.object({
  id: z.uuid().optional(),
  type: z.string().min(1),
  provider: z.string().min(1),
  providerAccountId: z.string().min(1),

  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  expiresAt: z.date().nullable().optional(),

  userId: z.uuid(),

  createdAt: z.date().optional(),
});

export type Account = z.infer<typeof accountSchema>;