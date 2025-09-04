import { idSchema } from "@memora/schemas";
import { BadRequestException, Body, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import z from "zod";

import { IService } from "./service.interface";

import type { FilterOptions } from './filter-options';
export abstract class GenericController<TEntity> {
  constructor(
    protected service: IService<TEntity>,
    protected filterSchema: z.ZodType<FilterOptions<TEntity>>,
    protected createDtoSchema: z.ZodType<Partial<TEntity>>,
    protected updateDtoSchema: z.ZodType<Partial<TEntity>>,
  ) {}

  @Get(":id")
  async findByID(@Param("id") id: string): Promise<TEntity | null> {
    this.validateSchema(idSchema, id);
    return this.service.findByID(id);
  }

  @Get()
  async findMany(@Query() allParams: Record<string, unknown>): Promise<TEntity[]> {
    const opts = this.paramsToFilter(allParams);
    this.validateSchema(this.filterSchema, opts);
    return this.service.find(opts);
  }

  @Post()
  async create(@Body() data: Partial<TEntity>): Promise<TEntity> {
    this.validateSchema(this.createDtoSchema, data);
    return this.service.create(data);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: Partial<TEntity>): Promise<void> {
    this.validateSchema(idSchema, id);
    this.validateSchema(this.updateDtoSchema, data);
    return this.service.update(id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    this.validateSchema(idSchema, id);
    return this.service.delete(id);
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
        result.filter[filterMatch[1]] = value;
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