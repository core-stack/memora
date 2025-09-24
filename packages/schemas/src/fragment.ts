import z from "zod";

export enum OriginType {
  PLUGIN = "PLUGIN",
  FILES = "FILES"
}

export const originTypeSchema = z.nativeEnum(OriginType);

export const fragmentSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  cached: z.boolean(),
  originType: originTypeSchema,
  originId: z.string().uuid(),
  tenantId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type Fragment = z.infer<typeof fragmentSchema>;
