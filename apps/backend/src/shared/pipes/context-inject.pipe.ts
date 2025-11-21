import { AuthRequest } from "@/types/auth-request";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

import { CONTEXT_FIELDS_KEY } from "../controller/decorators/context";

import type { ExecutionContext } from "@nestjs/common";
@Injectable()
export class ContextInjectPipe implements PipeTransform {
  constructor(private readonly context: ExecutionContext) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || typeof value !== "object") return value;

    const request: AuthRequest = this.context.switchToHttp().getRequest();

    const contextSources = {
      params: request.params,
      query: request.query,
      session: request.session,
      user: request.session?.user
    };

    const fields =
      Reflect.getMetadata(CONTEXT_FIELDS_KEY, metadata.metatype) || [];

    for (const { propertyKey, source, key } of fields) {
      const sourceValue = contextSources[source];
      if (!sourceValue) continue;

      const contextValue =
        key && typeof sourceValue === "object"
          ? sourceValue[key]
          : sourceValue;

      if (contextValue !== undefined) {
        value[propertyKey] = contextValue;
      }
    }

    return value;
  }
}
