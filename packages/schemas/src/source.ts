import z from 'zod';

import { filterSchema, orderSchema } from './shared';
import { SourceType, sourceTypeSchema } from './source-type';

export const indexStatusSchema = z.enum(["PENDING", "INDEXED", "INDEXING", "ERROR"]);
export type IndexStatus = z.infer<typeof indexStatusSchema>;

export const baseFileMetadata = z.object({
  extension: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  lastModified: z.number().int().optional(),
  exif: z.record(z.any()).optional()
});
export type BaseFileMetadata = z.infer<typeof baseFileMetadata>;

export const sourceDocMetadataSchema = baseFileMetadata.extend({
  type: z.literal(SourceType.DOC)
});
export type SourceDocMetadata = z.infer<typeof sourceDocMetadataSchema>;

export const sourceLinkMetadataSchema = z.object({
  type: z.literal(SourceType.LINK),
  url: z.string().url(),
});
export type SourceLinkMetadata = z.infer<typeof sourceLinkMetadataSchema>;

export const sourceVideoMetadataSchema = baseFileMetadata.extend({
  type: z.literal(SourceType.VIDEO),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  duration: z.number().int().optional()
});
export type SourceVideoMetadata = z.infer<typeof sourceVideoMetadataSchema>;

export const sourceAudioMetadataSchema = baseFileMetadata.extend({
  type: z.literal(SourceType.AUDIO),
  duration: z.number().int().optional()
});
export type SourceAudioMetadata = z.infer<typeof sourceAudioMetadataSchema>;

export const sourceImageMetadataSchema = baseFileMetadata.extend({
  type: z.literal(SourceType.IMAGE),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});
export type SourceImageMetadata = z.infer<typeof sourceImageMetadataSchema>;

export const sourceSchema = z.object({
  id: z.string().uuid(),

  key: z.string(),
  path: z.string().optional(),
  name: z.string().max(255),
  description: z.string().optional(),

  originalName: z.string(),
  metadata: z.discriminatedUnion("type", [
    sourceDocMetadataSchema,
    sourceLinkMetadataSchema,
    sourceVideoMetadataSchema,
    sourceAudioMetadataSchema,
    sourceImageMetadataSchema
  ]),

  sourceType: sourceTypeSchema,

  indexStatus: indexStatusSchema,
  indexError: z.string().optional(),

  memoryId: z.string().uuid().optional(),
  knowledgeId: z.string().uuid(),
  folderId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Source = z.infer<typeof sourceSchema>;

export const sourceFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().nullable().optional(),
    key: z.string().optional(),
    name: z.string().optional(),
    originalName: z.string().optional(),
    indexStatus: indexStatusSchema.optional(),
    folderId: z.string().uuid().nullable().optional(),
  }).strict().optional(),
  order: z.object({
    name: orderSchema,
    originalName: orderSchema,
    indexStatus: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional(),
}).strict();

export type SourceFilter = z.infer<typeof sourceFilterSchema>;

export const createSourceSchema = sourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  indexStatus: true,
  indexError: true,
  knowledgeId: true,
  memoryId: true,
}).extend({
  folderId: z.string().uuid().optional(),
});
export type CreateSource = z.infer<typeof createSourceSchema>;

export const updateSourceSchema = sourceSchema.omit({
  createdAt: true,
  updatedAt: true,
  indexStatus: true,
  indexError: true,
  memoryId: true,
});
export type UpdateSource = z.infer<typeof updateSourceSchema>;

export const getUploadUrlSchema = z.object({
  fileName: z.string({ message: "File name is required" }).min(1, "File name cannot be empty"),
  contentType: z.string({ message: "Content type is required" }).min(1, "Content type cannot be empty"),
  fileSize: z.number({ message: "File size is required" }).max(100 * 1024 * 1024, "File size must be less than 100MB"),
});
export type GetUploadUrl = z.infer<typeof getUploadUrlSchema>;
