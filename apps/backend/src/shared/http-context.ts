import { CookieOptions, Response } from 'express';
import { CLS_REQ, CLS_RES, ClsService } from 'nestjs-cls';

import { AuthRequest } from '@/@types/auth-request';
import { Session } from '@/modules/auth/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HTTPContext<
  Params = Record<string, string | number | boolean | undefined>,
  Query = Record<string, any>
> extends ClsService {
  get req(): AuthRequest { return this.get(CLS_REQ); }
  get res(): Response { return this.get(CLS_RES); }

  get params(): Params { return this.req.params as Params; }
  get query(): Query { return this.req.query as Query; }

  get session(): Session | undefined { return this.req.session; }

  get user(): Session["user"] | undefined { return this.session?.user; }

  get memberId(): string | undefined {
    const tenantId = this.params["tenantId"];
    return this.session?.tenants.find(w => w.id === tenantId)?.memberId;
  }

  getCookie(name: string): string | undefined {
    return this.req.cookies[name];
  }

  setCookie(name: string, value: string, options: CookieOptions = {}) {
    if (!this.res) {
      console.warn("Missing response in http context to set cookie");
    }
    return this.res.cookie(name, value, options);
  }

  deleteCookies(names: string | string[]) {
    if (!this.res) {
      console.warn("Missing response in http context to delete cookie");
    }
    names = Array.isArray(names) ? names : [names];
    names.forEach((name) => {
      this.res.clearCookie(name);
    })
  }
}