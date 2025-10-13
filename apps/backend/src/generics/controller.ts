import z from 'zod';

import { idSchema } from '@memora/schemas';
import {
  BadRequestException, Body, Delete, Get, Param, Post, Put, Query, Req
} from '@nestjs/common';

import { HttpContext } from './http-context';
import { ICrudService } from './service.interface';

import type { FilterOptions } from './filter-options';
import type { Request } from 'express';
import { param } from 'drizzle-orm';
import { kMaxLength } from 'buffer';
export abstract class CrudController<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> {
  constructor(
    protected readonly service: ICrudService<TEntity, TCreateDto, TUpdateDto>,
    protected readonly filterSchema: z.ZodType<FilterOptions<TEntity>>,
    protected readonly createDtoSchema: z.ZodType<TCreateDto>,
    protected readonly updateDtoSchema: z.ZodType<TUpdateDto>,
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
  async findMany(
    @Req() req: Request,
    @Query() allParams: Record<string, unknown>,
    @Param() params: Record<string, unknown>
  ): Promise<TEntity[]> {
    let opts = queryToFilter(allParams);
    const filterKeys = Object.keys((this.filterSchema._def as any).shape().filter._def.innerType._def.shape());
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([k]) => filterKeys.some(f => f === k)));
    opts = { ...opts, filter: { ...filteredParams, ...opts.filter } };
    this.validateSchema(this.filterSchema, opts);
    return this.service.find(opts, this.loadContext(req));
  }

  @Post()
  async create(@Req() req: Request, @Body() data: TCreateDto): Promise<TEntity> {
    this.validateSchema(this.createDtoSchema, data);
    return this.service.create(data, this.loadContext(req));
  }

  @Put(":id")
  async update(@Req() req: Request, @Param("id") id: string, @Body() data: TUpdateDto) {
    this.validateSchema(idSchema, id);
    this.validateSchema(this.updateDtoSchema, data);
    await this.service.update(id, data, this.loadContext(req));
    return { message: "Update successful" };
  }

  @Delete(":id")
  async delete(@Req() req: Request, @Param("id") id: string) {
    this.validateSchema(idSchema, id);
    await this.service.delete(id, this.loadContext(req));
    return { message: "Delete successful" };
  }

  protected validateSchema<T>(schema: z.ZodType<T>, data: T): T {
    const result = schema.safeParse(data);
    if (result.success) return result.data;
    console.error(result.error);

    throw new BadRequestException(result.error.format());
  }
}
export const queryToFilter = <TEntity>(allQueryParams: Record<string, unknown>): FilterOptions<TEntity> => {
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