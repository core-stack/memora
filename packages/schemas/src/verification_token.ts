import { z } from "zod";

export const verificationTokenSchema = z.object({
  id: z.uuid().optional(),
  identifier: z.string().min(1),
  token: z.string().min(1),
  expires: z.date(),
  userId: z.uuid(),
});

export type VerificationTokenSchema = z.infer<typeof verificationTokenSchema>;
