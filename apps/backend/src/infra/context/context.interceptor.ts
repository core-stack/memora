import { Observable } from 'rxjs';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';

import { ContextProvider } from './context.provider';

@Injectable({ scope: Scope.REQUEST })
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly ctxProvider: ContextProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const crudCtx = ContextProvider.fromExecutionContext(context);
    this.ctxProvider.context = crudCtx;

    return next.handle();
  }
}
