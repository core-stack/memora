import z, { ZodTypeAny } from 'zod';

import { Injectable } from '@nestjs/common';

import { IInputSchema } from './types/plugin-definition';

@Injectable()
export class PluginSchemaBuilderService {
  constructor() {}

  private buildZodFromSchema(def: IInputSchema): ZodTypeAny {
    let base: ZodTypeAny;
  
    switch (def.type) {
      case "string":
        base = z.string();
        break;
      case "number":
        base = z.number();
        break;
      case "boolean":
        base = z.boolean();
        break;
      case "object":
        if (!def.child || Array.isArray(def.child)) {
          throw new Error("Object type requires child as Record<string, IInputSchema>");
        }
        base = this.buildInputObjectSchema(def.child as Record<string, IInputSchema>);
        break;
      case "array":
        if (!def.child || Array.isArray(def.child)) {
          throw new Error("Array type requires child as IInputSchema");
        }
        base = z.array(this.buildZodFromSchema(def.child as IInputSchema));
        break;
      default:
        throw new Error(`Unsupported type: ${def.type}`);
    }
  
    return def.required ? base : base.optional();
  }
  
  buildInputObjectSchema(defs: Record<string, IInputSchema>) {
    const shape: Record<string, ZodTypeAny> = {};
    for (const [key, schema] of Object.entries(defs)) {
      shape[key] = this.buildZodFromSchema(schema);
    }
    return z.object(shape);
  }
  
}