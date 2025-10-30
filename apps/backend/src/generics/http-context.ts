import { BadRequestException } from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";

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
  constructor(query: Record<string, string | number | boolean | undefined>) {
    super(query, "query");
  }
}

export class HttpContext {
  params: Params;
  query: Query;

  constructor(request: Request, private response?: Response) {
    this.params = new Params(request.params);
    this.query = new Query(request.query as Record<string, string | number | boolean | undefined>);
  }

  setCookie(name: string, value: string, options: CookieOptions = {}) {
    if (!this.response) {
      console.warn("Missing response in http context to set cookie");
    }
    return this.response?.cookie(name, value, options);
  }

  deleteCookies(names: string | string[]) {
    if (!this.response) {
      console.warn("Missing response in http context to delete cookie");
    }
    names = Array.isArray(names) ? names : [names];
    names.forEach((name) => {
      this.response?.clearCookie(name);
    })
  }
}