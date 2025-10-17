import z from 'zod';

import { sourceTypeSchema } from '../source-type';
import { baseFragmentSchema } from './base';

export enum OriginType {
  PLUGIN = "PLUGIN",
  FILE = "FILE"
}

export const originTypeSchema = z.nativeEnum(OriginType);

export const fragmentFileMetadataSchema = z.object({
  type: z.literal(OriginType.FILE),

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

export const sourceFragmentMetadataSchema = z.discriminatedUnion("type", [
  fragmentFileMetadataSchema,
  fragmentPluginMetadata
]);

export type SourceFragmentMetadata = z.infer<typeof sourceFragmentMetadataSchema>;

export const sourceFragmentSchema = baseFragmentSchema.extend({
  sourceType: sourceTypeSchema,
  seqId: z.number().optional(),
  sourceId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  tenantId: z.string().uuid(),
  metadata: sourceFragmentMetadataSchema
});

export type SourceFragment = z.infer<typeof sourceFragmentSchema>;
