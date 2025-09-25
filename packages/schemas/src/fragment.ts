import z from "zod";

export enum OriginType {
  PLUGIN = "PLUGIN",
  FILES = "FILES"
}

export const originTypeSchema = z.nativeEnum(OriginType);

export const fragmentFileMetadataSchema = z.object({
  type: z.literal(OriginType.FILES),

  seqId: z.number().optional(), // sequential id

  size: z.number(),
  name: z.string(),
  extension: z.string(),
  contentType: z.string(),
  path: z.string(),

  // image/video
  width: z.number().optional(),
  height: z.number().optional(),

  // audio/video
  duration: z.number().optional(),

  // text start/end
  start: z.number().optional(),
  end: z.number().optional(),
});
export type FragmentFileMetadata = z.infer<typeof fragmentFileMetadataSchema>;

export const fragmentPluginMetadata = z.object({
  type: z.literal(OriginType.PLUGIN),
});
export type FragmentPluginMetadata = z.infer<typeof fragmentPluginMetadata>;

export const fragmentMetadataSchema = z.discriminatedUnion("type", [
  fragmentFileMetadataSchema,
  fragmentPluginMetadata
]);

export type FragmentMetadata = z.infer<typeof fragmentMetadataSchema>;

export const fragmentSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  cached: z.boolean(),
  originType: originTypeSchema,
  originId: z.string().uuid(),
  tenantId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: fragmentMetadataSchema
});

export type Fragment = z.infer<typeof fragmentSchema>;
