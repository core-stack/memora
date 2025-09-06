import { Request } from 'express';

import { Context } from '@/generics/context';
import { ExecutionContext, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextProvider {
  private _context: Context;

  get context() {
    return this._context
  }

  set context(context: Context) {
    this._context = context
  }

  static fromExecutionContext(ctx: ExecutionContext): Context {
    const req = ctx.switchToHttp().getRequest<Request>();

    return new Context(req);
  }
}