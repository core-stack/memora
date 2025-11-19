import { ObjectLiteral } from 'typeorm';

import { Constructor } from '@/types/constructor';
import {
  applyDecorators, Body, Delete, Get, Param, ParseUUIDPipe, Post, Put
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { ControllerFilter, Filter } from './decorators/filter';
import { Public } from './decorators/public';
import { FilterOptions } from './filter-options';
import { GenericResponse } from './generic-response';
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
  entity,
  createDto,
  updateDto,
  allowedFilters = [],
  allowedRelations = [],
  ignore = [],
  publicRoutes = [],
}: {
  entity: Constructor<TEntity>,
  createDto?: Constructor<TCreateDto>,
  updateDto?: Constructor<TUpdateDto>,
  allowedFilters?: (keyof TEntity)[];
  allowedRelations?: (keyof TEntity)[];
  ignore?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
  publicRoutes?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
}) {
  @ControllerFilter({ allowedFilters, allowedRelations })
  abstract class Base {
    constructor(public readonly service: Service<TEntity>) {}

    @Public(publicRoutes.includes("findByID"))
    @HttpGet(":id", ignore.includes("findByID"))
    @ApiResponse({ status: 200, description: 'The found record', type: entity })
    async findByID(@Param("id", ParseUUIDPipe) id: string): Promise<TEntity | null> {
      return this.service.findByID(id);
    }

    @Public(publicRoutes.includes("find"))
    @HttpGet("", ignore.includes("find"))
    @ApiResponse({ status: 200, description: 'A list of records', type: entity, isArray: true })
    async findMany(@Filter() filterOpts: FilterOptions<TEntity>): Promise<TEntity[]> {
      return this.service.find(filterOpts);
    }

    @Public(publicRoutes.includes("create"))
    @HttpPost("", ignore.includes("create"))
    @ApiResponse({ status: 201, description: 'The created record', type: entity })
    @ApiBody({ type: createDto })
    async create(@Body() body: TCreateDto): Promise<TEntity> {
      return this.service.create(body as unknown as TEntity);
    }

    @Public(publicRoutes.includes("update"))
    @HttpPut(":id", ignore.includes("update"))
    @ApiResponse({ status: 200, description: 'The updated record', type: GenericResponse })
    @ApiBody({ type: updateDto })
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() body: TUpdateDto) {
      await this.service.update(id, body as unknown as TEntity);
      return new GenericResponse("Update successful");
    }

    @Public(publicRoutes.includes("delete"))
    @HttpDelete(":id", ignore?.includes("delete"))
    @ApiResponse({ status: 200, description: 'The updated record', type: GenericResponse })
    async delete(@Param("id", ParseUUIDPipe) id: string) {
      await this.service.delete(id);
      return new GenericResponse("Delete successful");
    }
  }

  return Base;
}