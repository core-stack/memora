import z from 'zod';

export const inputSchema = z.lazy(() => z.object({
  type: z.enum(["string", "number", "boolean", "object", "array"]),
  required: z.boolean(),
  description: z.string(),
  child: z.array(inputSchema).or(inputSchema).optional()
})).superRefine((data, ctx) => {
  if ((data.type === "object" || data.type === "array") && !data.child) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Input child is required when type is object or array",
    });
  }
});
export type IInputSchema = {
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description: string;
  child?: IInputSchema[] | IInputSchema | Record<string, IInputSchema>;
}

export const configSchema = z.lazy(() => z.object({
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
export type IConfigSchema = z.infer<typeof configSchema>;

export const pluginDefinitionSchema = z.object({
  name: z.string(),
  displayName: z.string().optional(),
  version: z.string(),
  description: z.string(),
  type: z.string(),
  inputSchema: z.record(z.string(), inputSchema),
  configSchema: z.record(z.string(), configSchema).optional(),
  documentation: z.string().optional(),
  documentationPath: z.string().optional(),
  iconPath: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.type !== "source") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Plugin type must be 'source'",
    });
  }
  if (!data.documentation && !data.documentationPath) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Documentation or documentation path is required",
    });
  }
  if (!data.displayName) data.displayName = data.name;
});

export type PluginDefinition = z.infer<typeof pluginDefinitionSchema>;