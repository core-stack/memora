import { AuthRequest } from "@/types/auth-request";
import { Constructor } from "@/types/constructor";
import { Body, createParamDecorator, ExecutionContext } from "@nestjs/common";

import { CONTEXT_FIELDS_KEY } from "./context";

export const ApplyFromContext = createParamDecorator((data: Constructor<any>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  const contextSources = {
    params: request.params,
    query: request.query,
    session: request.session,
    user: request.session?.user
  };

  const fields = Reflect.getMetadata(CONTEXT_FIELDS_KEY, data) || [];
  for (const { propertyKey, source, key } of fields) {
    const sourceValue = contextSources[source];
    if (!sourceValue) continue;

    const contextValue =
      key && typeof sourceValue === "object"
        ? sourceValue[key]
        : sourceValue;

    if (contextValue !== undefined) {
      data[propertyKey] = contextValue;
    }
  }
  request.body = { ...request.body, ...data };
});

export const HttpBody = (dto: Constructor<any>) => {
  const httpBodyFn = ApplyFromContext(dto);
  const bodyFn = Body();
  return (target: any, key: string, index: number) => {
    httpBodyFn(target, key, index);
    bodyFn(target, key, index);
  };
};
