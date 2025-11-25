import {
  EntityManager, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository
} from "typeorm";

import { Logger } from "@nestjs/common";

import { FilterOptions } from "./filter-options";
import { GenericService } from "./generic-service";

export abstract class Service<
  TEntity extends ObjectLiteral,
  TCreateDto = TEntity,
  TUpdateDto = Partial<TEntity>
> extends GenericService {
  abstract readonly entity: new (...args: any) => TEntity;
  abstract readonly logger: Logger;
  readonly idField: keyof TEntity = "id";

  repository(manager?: EntityManager): Repository<TEntity> {
    return manager ? manager.getRepository(this.entity) : this.dataSource.getRepository(this.entity);
  }

  async find(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity[]> {
    return await this.repository(manager).find(filterOptions);
  }

  async findUnique(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity | null> {
    return await this.repository(manager).findOneOrFail(filterOptions);
  }

  async findFirst(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity | null> {
    filterOptions.take = 1;
    filterOptions.skip = 0;

    const data = await this.repository(manager).find(filterOptions);

    return data.length === 0 ? null : data[0];
  }

  async findByID(
    id: string,
    opts?: Omit<FindOneOptions<TEntity>, "where"> & { manager?: EntityManager }
  ): Promise<TEntity | null> {
    return await this.repository(opts?.manager)
      .findOne({ ...opts, where: { [this.idField]: id } as FindOptionsWhere<TEntity> } );
  }

  async create(input: TCreateDto, manager?: EntityManager): Promise<TEntity> {
    return await this.repository(manager).save(input as unknown as TEntity);
  }

  async update(id: string, input: TUpdateDto, manager?: EntityManager): Promise<void> {
    await this.repository(manager).update(id, input as unknown as TEntity);
  }

  async delete(id: string, manager?: EntityManager): Promise<void> {
    await this.repository(manager).delete(id);
  }
}
