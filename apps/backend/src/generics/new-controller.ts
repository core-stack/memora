import z from 'zod';

import { ZodBody } from '@/shared/decorators/zod-body';
import { ZodParam } from '@/shared/decorators/zod-param';
import {
  applyDecorators, BadRequestException, Delete, Get, Param, Post, Put, Query, Req
} from '@nestjs/common';
import { idSchema } from '@snipet/schemas';

import { HttpContext } from './http-context';

import type { ICrudService } from './service.interface';

import type { FilterOptions } from './filter-options';
import type { Request, Response } from 'express';
export const Http = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, ignore?: boolean) => {
  if (ignore) return applyDecorators();
  switch (method) {
    case "GET":
      return Get(path);
    case "POST":
      return Post(path);
    case "PUT":
      return Put(path);
    case "PATCH":
      return Put(path);
    case "DELETE":
      return Delete(path);
  }
}

export const HttpGet = (path?: string, ignore?: boolean) => Http("GET", path ?? "", ignore);
export const HttpPost = (path?: string, ignore?: boolean) => Http("POST", path ?? "", ignore);
export const HttpPut = (path?: string, ignore?: boolean) => Http("PUT", path ?? "", ignore);
export const HttpPatch = (path?: string, ignore?: boolean) => Http("PATCH", path ?? "", ignore);
export const HttpDelete = (path?: string, ignore?: boolean) => Http("DELETE", path ?? "", ignore);

export const queryToFilter = <TEntity>(params: Record<string, unknown>): FilterOptions<TEntity> => {
  const result: FilterOptions<TEntity> = { filter: {} };

  for (const [key, value] of Object.entries(params)) {
    if (key === 'limit' || key === 'offset') {
      result[key] = parseInt(value as string);
      continue;
    }

    const match = key.match(/^filter\[(.+)\]$/);
    if (match) {
      const field = match[1] as any;
      result.filter![field] = value === 'null' ? null : value;
    }
  }

  if (params.sort) {
    const fields = (params.sort as string).split(',');
    result.order = fields.reduce((acc, f) => {
      if (f.startsWith('-')) acc[f.substring(1) as keyof TEntity] = 'DESC';
      else acc[f as keyof TEntity] = 'ASC';
      return acc;
    }, {} as Partial<Record<keyof TEntity, 'ASC' | 'DESC'>>);
  }

  if (params.include) {
    result.include = (params.include as string).split(',') as any;
  }
  return result;
};

export function CrudController<TEntity, TCreateDto = TEntity, TUpdateDto = TEntity>({
  allowedFilters = [],
  allowedIncludes = [],
  ignore = [],
  publicRoutes = [],
}: {
  allowedFilters?: (keyof TEntity)[];
  allowedIncludes?: string[];
  ignore?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
  publicRoutes?: string[];
}) {
  abstract class Base {
    constructor(public readonly service: ICrudService<TEntity, TCreateDto, TUpdateDto>) {}

    public loadContext(req: Request, res?: Response) {
      return new HttpContext(req, res);
    }

    @HttpGet(":id", ignore.includes("findByID"))
    async findByID(@Req() req: Request, @ZodParam("id", idSchema) id: string): Promise<TEntity | null> {
      this.validateSchema(idSchema, id);
      return this.service.findByID(id, { http: this.loadContext(req) });
    }

    @HttpGet("", ignore.includes("find"))
    async findMany(
      @Req() req: Request,
      @Query() allParams: Record<string, unknown>,
      @Param() params: Record<string, unknown>
    ): Promise<TEntity[]> {
      let opts = queryToFilter(allParams);
      const filterKeys = Object.keys(z.toJSONSchema(filterSchema).properties ?? {});
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([k]) => filterKeys.some(f => f === k)));
      opts = { ...opts, filter: { ...filteredParams, ...opts.filter } };
      this.validateSchema(filterSchema, opts);
      return this.service.find(opts, { http: this.loadContext(req) });
    }

    @HttpPost("", ignore?.includes("create"))
    async create(
      @Req() req: Request,
      @ZodBody(createDtoSchema) data: TCreateDto
    ): Promise<TEntity> {
      return this.service.create(data, { http: this.loadContext(req) });
    }

    @HttpPut(":id", ignore?.includes("update"))
    async update(
      @Req() req: Request,
      @ZodParam("id", idSchema) id: string,
      @ZodBody(updateDtoSchema) data: TUpdateDto
    ) {
      await this.service.update(id, data, { http: this.loadContext(req) });
      return { message: "Update successful" };
    }

    @HttpDelete(":id", ignore?.includes("delete"))
    async delete(
      @Req() req: Request,
      @ZodParam("id", idSchema) id: string
    ) {
      await this.service.delete(id, { http: this.loadContext(req) });
      return { message: "Delete successful" };
    }

    public validateSchema<T>(schema: z.ZodType<T>, data: T): T {
      const result = schema.safeParse(data);
      if (result.success) return result.data;
      console.error(result.error);

      throw new BadRequestException(result.error.format());
    }
  }

  return Base;
}