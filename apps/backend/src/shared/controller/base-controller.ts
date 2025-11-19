import { ObjectLiteral } from "typeorm";
import { GenericResponse } from "./generic-response";
import { Constructor } from "@/types/constructor";
import { ControllerResponses } from "./types";
import { Body, Param, ParseUUIDPipe } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { HttpGet } from "./decorators";
import { Service } from "../service";
import { ControllerFilter, Filter } from "../decorators/filter";
import { FilterOptions } from "../filter-options";
import { HttpDelete, HttpPost, HttpPut } from "./decorators";
import {
  getDefaultCreateResponses,
  getDefaultDeleteResponses,
  getDefaultFindByIDResponses,
  getDefaultFindResponses,
  getDefaultUpdateResponses
} from "./default-response";

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
  responses = {
    create: getDefaultCreateResponses(entity),
    find: getDefaultFindResponses(entity),
    findByID: getDefaultFindByIDResponses(entity),
    update: getDefaultUpdateResponses(entity),
    delete: getDefaultDeleteResponses(entity),
  }
}: {
  entity: Constructor<TEntity>;
  createDto?: Constructor<TCreateDto>;
  updateDto?: Constructor<TUpdateDto>;
  allowedFilters?: (keyof TEntity)[];
  allowedRelations?: (keyof TEntity)[];
  ignore?: Array<'find' | 'findByID' | 'create' | 'update' | 'delete'>;
  responses?: ControllerResponses;
}) {
  @ControllerFilter({ allowedFilters, allowedRelations })
  abstract class Base {
    constructor(public readonly service: Service<TEntity>) {}

    @HttpGet(":id", { ignore: ignore.includes("findByID"), responses: responses.findByID })
    async findByID(@Param("id", ParseUUIDPipe) id: string): Promise<TEntity | null> {
      return this.service.findByID(id);
    }

    @HttpGet("", { ignore: ignore.includes("find"), responses: responses.find })
    async findMany(@Filter() filterOpts: FilterOptions<TEntity>): Promise<TEntity[]> {
      return this.service.find(filterOpts);
    }

    @HttpPost("", { ignore: ignore.includes("create"), responses: responses.create })
    @ApiBody({ type: createDto })
    async create(@Body() body: TCreateDto): Promise<TEntity> {
      return this.service.create(body as unknown as TEntity);
    }

    @HttpPut(":id", { ignore: ignore.includes("update"), responses: responses.update })
    @ApiBody({ type: updateDto })
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() body: TUpdateDto) {
      await this.service.update(id, body as unknown as TEntity);
      return new GenericResponse("Update successful");
    }

    @HttpDelete(":id", { ignore: ignore.includes("delete"), responses: responses.delete })
    async delete(@Param("id", ParseUUIDPipe) id: string) {
      await this.service.delete(id);
      return new GenericResponse("Delete successful");
    }
  }
  return Base;
}