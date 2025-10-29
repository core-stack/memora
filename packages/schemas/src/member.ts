import { z } from "zod";

export const memberSchema = z.object({
  id: z.uuid().optional(),

  userId: z.uuid(),
  tenantId: z.uuid(),
  roleId: z.uuid().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MemberSchema = z.infer<typeof memberSchema>;
