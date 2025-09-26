import z from 'zod';

import { filterSchema, orderSchema } from './shared';
import { sourceTypeSchema } from './source-type';

export const indexStatusSchema = z.enum(["PENDING", "INDEXED", "INDEXING", "ERROR"]);

export const baseSourceSchema = z.object({
  id: z.string().uuid(),

  key: z.string().max(255),
  name: z.string().max(255),
  description: z.string().optional(),

  originalName: z.string(),
  extension: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  url: z.string().url().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),

  sourceType: sourceTypeSchema,
  indexStatus: indexStatusSchema,
  indexError: z.string().optional(),

  memoryId: z.string().uuid().optional(),
  knowledgeId: z.string().uuid(),
  folderId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const withSourceRefinements = <T extends z.ZodType>(schema: T): z.ZodEffects<T> =>
  schema.superRefine((data: any, ctx) => {
    if (!data.originalName && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Original name is required" });
    }
    if (!data.extension && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Extension is required" });
    }
    if (!data.contentType && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Content type is required" });
    }
    if (!data.size && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Size is required" });
    }
    if (!data.width && ["IMAGE", "VIDEO"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Width is required" });
    }
    if (!data.height && ["IMAGE", "VIDEO"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Height is required" });
    }
  });

export const sourceSchema = withSourceRefinements(baseSourceSchema);

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

export const createSourceSchema = withSourceRefinements(baseSourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  indexStatus: true,
  indexError: true,
  knowledgeId: true,
  memoryId: true,
}).extend({
  folderId: z.string().uuid().optional(),
}));
export type CreateSource = z.infer<typeof createSourceSchema>;

export const updateSourceSchema = withSourceRefinements(baseSourceSchema.omit({
  createdAt: true,
  updatedAt: true,
  indexStatus: true,
  indexError: true,
  memoryId: true,
}));
export type UpdateSource = z.infer<typeof updateSourceSchema>;

export const getUploadUrlSchema = z.object({
  fileName: z.string({ message: "File name is required" }).min(1, "File name cannot be empty"),
  contentType: z.string({ message: "Content type is required" }).min(1, "Content type cannot be empty"),
  fileSize: z.number({ message: "File size is required" }).max(100 * 1024 * 1024, "File size must be less than 100MB"),
});
export type GetUploadUrl = z.infer<typeof getUploadUrlSchema>;
