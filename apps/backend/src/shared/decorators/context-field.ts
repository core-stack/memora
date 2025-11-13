import 'reflect-metadata';

export const CONTEXT_FIELDS_KEY = Symbol('context:fields');

export interface ContextFieldOptions {
  source: 'params' | 'query' | 'session' | 'memberId';
  key?: string;
}

export function ContextField(options: ContextFieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const existing =
      Reflect.getMetadata(CONTEXT_FIELDS_KEY, target.constructor) || [];
    existing.push({ propertyKey, ...options });
    Reflect.defineMetadata(CONTEXT_FIELDS_KEY, existing, target.constructor);
  };
}
