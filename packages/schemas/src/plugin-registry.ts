import z from 'zod';

export const configSchema: z.ZodType<IConfigSchema> = z.lazy((): z.ZodType<IConfigSchema> => z.object({
  type: z.enum(["string", "number", "boolean", "object", "secret-string", "secret-number", "secret-boolean"]),
  required: z.boolean(),
  description: z.string(),
  child: z.array(configSchema).or(configSchema).optional()
})).superRefine((data, ctx) => {
  if ((data.type === "object") && !data.child) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Config child is required when type is object",
    });
  }
});

export type IConfigSchema = {
  type: "string" | "number" | "boolean" | "object" | "secret-string" | "secret-number" | "secret-boolean";
  required: boolean;
  description: string;
  child?: IConfigSchema[] | IConfigSchema;
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