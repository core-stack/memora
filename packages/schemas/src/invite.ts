import { z } from "zod";

export const inviteSchema = z.object({
  id: z.uuid().optional(),
  email: z.email(),
  role: z.string().optional(),
  token: z.string().min(1),
  accepted: z.boolean().default(false),

  tenantId: z.uuid(),
  invitedById: z.uuid().nullable().optional(),
  memberId: z.uuid().nullable().optional(),

  createdAt: z.date().optional(),
  expiresAt: z.date(),
});

export type InviteSchema = z.infer<typeof inviteSchema>;
