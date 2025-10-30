import z from "zod";

export enum EmailTemplate {
  ACTIVE_ACCOUNT = "active-account",
  CHANGE_PASSWORD = "change-password",
  FORGET_PASSWORD = "forget-password",
  INVITE = "invite",
  NOTIFICATION = "notification",
  TENANT_DELETED = "tenant-deleted",
  TENANT_REACTIVATED = "tenant-reactivated",
  TENANT_WILL_BE_DELETED = "tenant-will-be-deleted", // days after deletion
}

const forgetPasswordSchema = z.object({
  resetUrl: z.url(),
  name: z.string().optional(),
});
const inviteSchema = z.object({
  tenantName: z.string(),
  inviteUrl: z.url(),
  role: z.string(),
  inviterName: z.string(),
  expirationDate: z.string(),
});
const activeAccountSchema = z.object({
  activationUrl: z.url(),
  name: z.string().optional(),
});
const changePasswordSchema = z.object({
  name: z.string().optional(),
});
const notificationSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.url().optional(),
  tenantName: z.string(),
});
const tenantDeletedSchema = z.object({
  tenantName: z.string(),
});
const tenantReactivatedSchema = z.object({
  tenantName: z.string(),
  tenantUrl: z.url(),
});
const tenantWillBeDeletedSchema = z.object({
  tenantName: z.string(),
  tenantReactivateUrl: z.url(),
});

export const emailPayloadSchema = z.discriminatedUnion("template", [
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.FORGET_PASSWORD),
    context: forgetPasswordSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.INVITE),
    context: inviteSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.ACTIVE_ACCOUNT),
    context: activeAccountSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.CHANGE_PASSWORD),
    context: changePasswordSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.TENANT_DELETED),
    context: tenantDeletedSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.TENANT_REACTIVATED),
    context: tenantReactivatedSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.TENANT_WILL_BE_DELETED),
    context: tenantWillBeDeletedSchema,
  }),
  z.object({
    to: z.email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.NOTIFICATION),
    context: notificationSchema,
  }),
]);

export type EmailPayload = z.infer<typeof emailPayloadSchema>;