import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { GenericService } from './service';

import type { FilterOptions } from './filter-options';

export abstract class GenericController {
  constructor(protected service: GenericService) {}

  @Get()
  async findMany(opts: FilterOptions): Promise<any[]> {
    return this.service.findMany(opts);
  }

  @Get(":id")
  async findByID(@Param("id") id: string): Promise<any> {
    return this.service.findByID(id);
  }

  @Post()
  async create(@Body() data: any): Promise<any> {
    return this.service.create(data);
  }

  @Put()
  async update(@Body() data: any): Promise<any> {
    return this.service.update(data.id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    return this.service.delete(id);
  }
}