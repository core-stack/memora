import { Observable } from 'rxjs';

import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';

import { CONTEXT_FIELDS_KEY } from '../decorators/context-field';
import { HTTPContext } from '../http-context';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly httpContext: HTTPContext) {}

  intercept(_: any, next: CallHandler): Observable<any> {
    const req = this.httpContext.req;
    const body = req.body;

    if (!body || typeof body !== 'object') return next.handle();

    const metatype = body.constructor;
    const fields =
      Reflect.getMetadata(CONTEXT_FIELDS_KEY, metatype) || [];

    if (!fields.length) return next.handle();

    for (const { propertyKey, source, key } of fields) {
      const value = this.resolveContextValue(source, key);
      if (value !== undefined && value !== null) {
        body[propertyKey] = value;
      }
    }

    return next.handle();
  }

  private resolveContextValue(source: string, key?: string): any {
    switch (source) {
      case 'params':
        return key ? this.httpContext.params[key] : this.httpContext.params;
      case 'query':
        return key ? this.httpContext.query[key] : this.httpContext.query;
      case 'session':
        return key ? this.httpContext.session?.[key] : this.httpContext.session;
      case 'memberId':
        return this.httpContext.memberId;
      case 'user':
        return this.httpContext.session?.user;
      default:
        return undefined;
    }
  }
}
