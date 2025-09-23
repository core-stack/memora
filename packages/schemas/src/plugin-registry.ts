import z from "zod";

import { filterSchema } from "./shared";

export const configSchema: z.ZodType<IConfigSchema> = z.lazy((): z.ZodType<IConfigSchema> => z.object({
  type: z.enum(["string", "number", "boolean", "secret-string", "secret-number"]),
  required: z.boolean(),
  default: z.any().optional(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
}));

export type IConfigSchema = {
  type: "string" | "number" | "boolean" | "secret-string" | "secret-number";
  required: boolean;
  default?: any;
  label?: string;
  placeholder?: string;
  description?: string;
};

export const pluginRegistrySchema = z.object({
  name: z.string(),
  displayName: z.string().optional(),
  version: z.string(),
  description: z.string(),
  type: z.string(),
  configSchema: z.record(z.string(), configSchema).optional(),
  documentationPath: z.string().optional(),
  iconPath: z.string().optional()
})

export type PluginRegistry = z.infer<typeof pluginRegistrySchema>;

export const pluginRegistryFilterSchema = filterSchema.extend({
  filter: z.object({
    name: z.string().optional(),
    type: z.string().optional(),
  }).strict().optional(),
}).strict();

export type PluginRegistryFilter = z.infer<typeof pluginRegistryFilterSchema>;
