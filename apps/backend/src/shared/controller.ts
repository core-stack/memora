import { ObjectLiteral } from 'typeorm';
import z from 'zod';

import { applyDecorators, Body, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { ControllerFilter, Filter } from './decorators/filter';
import { Public } from './decorators/public';
import { FilterOptions } from './filter-options';
import { Service } from './service';

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

export function BaseController<
  TEntity extends ObjectLiteral,
  TCreateDto = TEntity,
  TUpdateDto = Partial<TEntity>
>({
  allowedFilters = [],
  allowedRelations = [],
  ignore = [],
  publicRoutes = [],
}: {
  allowedFilters?: (keyof TEntity)[];
  allowedRelations?: (keyof TEntity)[];
  ignore?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
  publicRoutes?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
} = {}) {
  @ControllerFilter({ allowedFilters, allowedRelations })
  abstract class Base {
    constructor(public readonly service: Service<TEntity>) {}

    @Public(publicRoutes.includes("findByID"))
    @HttpGet(":id", ignore.includes("findByID"))
    async findByID(@Param("id", ParseUUIDPipe) id: string): Promise<TEntity | null> {
      return this.service.findByID(id);
    }

    @Public(publicRoutes.includes("find"))
    @HttpGet("", ignore.includes("find"))
    async findMany(@Filter() filterOpts: FilterOptions<TEntity>): Promise<TEntity[]> {
      return this.service.find(filterOpts);
    }

    @Public(publicRoutes.includes("create"))
    @HttpPost("", ignore.includes("create"))
    async create(@Body() body: TCreateDto): Promise<TEntity> {
      return this.service.create(body as unknown as TEntity);
    }

    @Public(publicRoutes.includes("update"))
    @HttpPut(":id", ignore.includes("update"))
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() body: TUpdateDto) {
      await this.service.update(id, body as unknown as TEntity);
      return { message: "Update successful" };
    }

    @Public(publicRoutes.includes("delete"))
    @HttpDelete(":id", ignore?.includes("delete"))
    async delete(@Param("id", ParseUUIDPipe) id: string) {
      await this.service.delete(id);
      return { message: "Delete successful" };
    }
  }

  return Base;
}