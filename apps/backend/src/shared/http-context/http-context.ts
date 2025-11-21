import { CookieOptions, Response } from "express";
import { CLS_REQ, CLS_RES, ClsService } from "nestjs-cls";

import { AuthRequest } from "@/types/auth-request";
import { Session } from "@/modules/auth/types";
import { BadRequestException, Injectable } from "@nestjs/common";

abstract class Getter {
  constructor(private params: Record<string, string | number | boolean | undefined>, private name: string) { }

  getString(key: string): string | undefined {
    const param = this.params[key];
    if (typeof param === "string") return param;
    if (param === undefined) return undefined;
    return String(param);
  }

  getNumber(key: string): number | undefined {
    const param = this.params[key];
    if (typeof param === "number") return param;
    if (param === undefined) return undefined;
    return Number(param);
  }

  getBoolean(key: string): boolean | undefined {
    const param = this.params[key];
    if (typeof param === "boolean") return param;
    if (param === undefined) return undefined;
    return Boolean(param);
  }

  shouldGetString(key: string): string {
    const res = this.getString(key);
    if (res === undefined) throw new BadRequestException(`Missing ${this.name} ${key}`);
    return res;
  }
  shouldGetNumber(key: string): number {
    const res = this.getNumber(key);
    if (res === undefined) throw new BadRequestException(`Missing ${this.name} ${key}`);
    return res;
  }
  shouldGetBoolean(key: string): boolean {
    const res = this.getBoolean(key);
    if (res === undefined) throw new BadRequestException(`Missing ${this.name} ${key}`);
    return res;
  }
}

export class Params extends Getter {
  constructor(params: Record<string, string | number | boolean | undefined>) {
    super(params, "param");
  }
}
export class Query extends Getter {
  constructor(query: any) {
    super(query, "query");
  }
}

@Injectable()
export class HTTPContext {
  constructor(private readonly cls: ClsService) {}

  get req(): AuthRequest { return this.cls.get(CLS_REQ); }
  get res(): Response { return this.cls.get(CLS_RES); }

  get params(): Params { return new Params(this.req.params); }
  get query(): Query { return new Query(this.req.query); }

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
    names = Array.isArray(names) ? names : [ names ];
    names.forEach((name) => {
      this.res.clearCookie(name);
    });
  }
}
