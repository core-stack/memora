import z from 'zod';

import { sourceTypeSchema } from './source-type';

export enum OriginType {
  PLUGIN = "PLUGIN",
  SOURCE = "SOURCE"
}

export const originTypeSchema = z.nativeEnum(OriginType);

export const fragmentFileMetadataSchema = z.object({
  type: z.literal(OriginType.SOURCE),

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
  cached: z.boolean().optional(),
  sourceType: sourceTypeSchema,
  sourceId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  tenantId: z.string().uuid(),
  createdAt: z.string().transform(d => new Date(d)).or(z.date()),
  updatedAt: z.string().transform(d => new Date(d)).or(z.date()),
  metadata: fragmentMetadataSchema
});

export type Fragment = z.infer<typeof fragmentSchema>;
