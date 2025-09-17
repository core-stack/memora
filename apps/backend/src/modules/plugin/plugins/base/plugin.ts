import z from "zod";

import { PluginConfigSchema } from "./config.interface";

export abstract class PluginInstance<T> {
  abstract configSchema: PluginConfigSchema<T>;

  constructor(public readonly id: string) {

  }

  private schemaFromConfig(): z.ZodType<T> {
    const shape: Record<keyof T, z.ZodTypeAny> = {} as Record<keyof T, z.ZodTypeAny>;

    for (const [k, type] of Object.entries(this.configSchema)) {
      const key = k as keyof T;
      switch (type) {
        case "string":
        case "secret-string":
          shape[key] = z.string();
          break;
        case "number":
        case "secret-number":
          shape[key] = z.number();
          break;
        case "boolean":
        case "secret-boolean":
          shape[key] = z.boolean();
          break;
        default:
          throw new Error(`Tipo desconhecido no schema: ${type}`);
      }
    }

    return z.object(shape) as unknown as z.ZodType<T>;
  }

  protected validateSchema(data: unknown): T {
    return this.schemaFromConfig().parse(data);
  }

  test(config: T): Promise<boolean> | boolean {
    try {
      this.validateSchema(config);
      return true;
    } catch (error) {
      return false;
    }
  }

  abstract load(config: T): Promise<void>;
  abstract unload(): Promise<void>;
  abstract run(): Promise<void>;
}