import z from 'zod';

import { idSchema } from '@memora/schemas';
import {
  BadRequestException, Body, Delete, Get, Param, Post, Put, Query, Req
} from '@nestjs/common';

import { HttpContext } from './http-context';
import { ICrudService } from './service.interface';

import type { FilterOptions } from './filter-options';
import type { Request } from 'express';
export abstract class CrudController<TEntity> {
  constructor(
    protected readonly service: ICrudService<TEntity>,
    protected readonly filterSchema: z.ZodType<FilterOptions<TEntity>>,
    protected readonly createDtoSchema: z.ZodType<Partial<TEntity>>,
    protected readonly updateDtoSchema: z.ZodType<Partial<TEntity>>,
  ) {}

  protected loadContext(req: Request) {
    return new HttpContext(req);
  }

  @Get(":id")
  async findByID(@Req() req: Request, @Param("id") id: string): Promise<TEntity | null> {
    this.validateSchema(idSchema, id);
    return this.service.findByID(id, this.loadContext(req));
  }

  @Get()
  async findMany(@Req() req: Request, @Query() allParams: Record<string, unknown>): Promise<TEntity[]> {
    const opts = this.paramsToFilter(allParams);
    this.validateSchema(this.filterSchema, opts);
    return this.service.find(opts, this.loadContext(req));
  }

  @Post()
  async create(@Req() req: Request, @Body() data: Partial<TEntity>): Promise<TEntity> {
    this.validateSchema(this.createDtoSchema, data);
    return this.service.create(data, this.loadContext(req));
  }

  @Put(":id")
  async update(@Req() req: Request, @Param("id") id: string, @Body() data: Partial<TEntity>): Promise<void> {
    this.validateSchema(idSchema, id);
    this.validateSchema(this.updateDtoSchema, data);
    return this.service.update(id, data, this.loadContext(req));
  }

  @Delete(":id")
  async delete(@Req() req: Request, @Param("id") id: string): Promise<void> {
    this.validateSchema(idSchema, id);
    return this.service.delete(id, this.loadContext(req));
  }

  protected validateSchema<T>(schema: z.ZodType<T>, data: T): T {
    const result = schema.safeParse(data);
    if (result.success) return result.data;
    console.error(result.error);

    throw new BadRequestException(result.error.format());
  }

  protected paramsToFilter(allParams: Record<string, unknown>): FilterOptions<TEntity> {
    const result: FilterOptions<TEntity> = {};
    for (const [key, value] of Object.entries(allParams)) {
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

    if (allParams.sort) {
      const fields = (allParams.sort as string).split(",");
      result.order = fields.reduce((acc, f) => {
        if (f.startsWith("-")) {
          return {...acc, [f.substring(1)]: "DESC"};
        }
        return {...acc, [f]: "ASC"}
      }, {} as Record<keyof TEntity, 'ASC' | 'DESC'>);
    }
    return result;
  }
}