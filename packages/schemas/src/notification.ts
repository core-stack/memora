import { z } from "zod";

export const notificationSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  read: z.boolean().default(false),

  tenantId: z.uuid(),
  memberId: z.uuid(),

  createdAt: z.date().optional(),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
