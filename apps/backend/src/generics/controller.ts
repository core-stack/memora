import z from 'zod';

import {
  applyDecorators,
  BadRequestException, Body, Delete, Get, Param, Post, Put, Query, Req
} from '@nestjs/common';
import { idSchema } from '@snipet/schemas';

import { HttpContext } from './http-context';
import { ICrudService } from './service.interface';

import type { FilterOptions } from './filter-options';
import type { Request } from 'express';
import e from 'express';

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

export const HttpGet = (path: string, ignore?: boolean) => Http("GET", path, ignore);
export const HttpPost = (path: string, ignore?: boolean) => Http("POST", path, ignore);
export const HttpPut = (path: string, ignore?: boolean) => Http("PUT", path, ignore);
export const HttpPatch = (path: string, ignore?: boolean) => Http("PATCH", path, ignore);
export const HttpDelete = (path: string, ignore?: boolean) => Http("DELETE", path, ignore);

const queryToFilter = <TEntity>(allQueryParams: Record<string, unknown>): FilterOptions<TEntity> => {
  const result: FilterOptions<TEntity> = { filter: {} };
  for (const [key, value] of Object.entries(allQueryParams)) {
    if (key === "limit" || key === "offset") {
      result[key] = parseInt(value as string);
      continue;
    }
    const filterMatch = key.match(/^filter\[(.+)\]$/);
    if (filterMatch) {
      result.filter = result.filter || {};
      result.filter[filterMatch[1]] = value === "null" ? null : value;
    }
  }

  if (allQueryParams.sort) {
    const fields = (allQueryParams.sort as string).split(",");
    result.order = fields.reduce((acc, f) => {
      if (f.startsWith("-")) {
        return {...acc, [f.substring(1)]: "DESC"};
      }
      return {...acc, [f]: "ASC"}
    }, {} as Record<keyof TEntity, 'ASC' | 'DESC'>);
  }
  if (allQueryParams.include) {
    result.include = (allQueryParams.include as string).split(",");
  }
  return result;
}

export function CrudController<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>>(
  filterSchema: z.ZodType<FilterOptions<TEntity>>,
  createDtoSchema: z.ZodType<TCreateDto>,
  updateDtoSchema: z.ZodType<TUpdateDto>,
  ignore?: Array<"find" | "findByID" | "create" | "update" | "delete">
) {
  abstract class Base {
    constructor(public readonly service: ICrudService<TEntity, TCreateDto, TUpdateDto>) {}

    public loadContext(req: Request) {
      return new HttpContext(req);
    }

    @HttpGet(":id", ignore?.includes("findByID"))
    async findByID(@Req() req: Request, @Param("id") id: string): Promise<TEntity | null> {
      this.validateSchema(idSchema, id);
      return this.service.findByID(id, this.loadContext(req));
    }

    @HttpGet("", ignore?.includes("find"))
    async findMany(
      @Req() req: Request,
      @Query() allParams: Record<string, unknown>,
      @Param() params: Record<string, unknown>
    ): Promise<TEntity[]> {
      let opts = queryToFilter(allParams);
      const filterKeys = Object.keys((filterSchema._def as any).shape().filter._def.innerType._def.shape());
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([k]) => filterKeys.some(f => f === k)));
      opts = { ...opts, filter: { ...filteredParams, ...opts.filter } };
      this.validateSchema(filterSchema, opts);
      return this.service.find(opts, this.loadContext(req));
    }

    @HttpPost("", ignore?.includes("create"))
    async create(@Req() req: Request, @Body() data: TCreateDto): Promise<TEntity> {
      this.validateSchema(createDtoSchema, data);
      return this.service.create(data, this.loadContext(req));
    }

    @HttpPut(":id", ignore?.includes("update"))
    async update(@Req() req: Request, @Param("id") id: string, @Body() data: TUpdateDto) {
      this.validateSchema(idSchema, id);
      this.validateSchema(updateDtoSchema, data);
      await this.service.update(id, data, this.loadContext(req));
      return { message: "Update successful" };
    }

    @HttpDelete(":id", ignore?.includes("delete"))
    async delete(@Req() req: Request, @Param("id") id: string) {
      this.validateSchema(idSchema, id);
      await this.service.delete(id, this.loadContext(req));
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