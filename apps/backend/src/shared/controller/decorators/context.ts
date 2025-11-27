import "reflect-metadata";

export const CONTEXT_FIELDS_KEY = Symbol("context:fields");

export interface ContextFieldOptions {
  source: "params" | "query" | "session" | "memberId";
  key?: string;
}

export function ContextField(options: ContextFieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const constructor = target.constructor;

    const existing = Reflect.getMetadata(CONTEXT_FIELDS_KEY, constructor) || [];

    if (!existing.find((item: any) => item.propertyKey === propertyKey)) {
      existing.push({ propertyKey, ...options });
      Reflect.defineMetadata(CONTEXT_FIELDS_KEY, existing, constructor);
    }
  };
}

// Mantenha os helpers
export const TenantId = () => ContextField({ source: "params", key: "tenantId" });
export const KnowledgeId = () => ContextField({ source: "params", key: "knowledgeId" });
export const CreatedBy = () => ContextField({ source: "session", key: "userId" });
export const MemberId = () => ContextField({ source: "memberId" });

export const FromQuery = (key: string) => ContextField({ source: "query", key });
export const FromParams = (key: string) => ContextField({ source: "params", key });
