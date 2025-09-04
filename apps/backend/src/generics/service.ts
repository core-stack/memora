

import { FilterOptions } from "./filter-options";
import { IRepository } from "./repository.interface";
import { IService } from "./service.interface";

export abstract class GenericService<TEntity> implements IService<TEntity> {
  public hooks: {
    beforeFind: ((opts: FilterOptions<TEntity>) => Promise<FilterOptions<TEntity>> | FilterOptions<TEntity>)[];
    afterFind: ((opts: FilterOptions<TEntity>, entities: TEntity[]) => Promise<TEntity[]> | TEntity[])[];
    beforeCreate: ((data: Partial<TEntity>) => Promise<Partial<TEntity>> | Partial<TEntity>)[];
    afterCreate: ((data: TEntity) => Promise<TEntity> | TEntity)[];
    beforeUpdate: ((id: string, data: Partial<TEntity>) => Promise<[string, TEntity]> | [string, TEntity])[];
    afterUpdate: ((id: string, data: TEntity) => Promise<void> | void)[];
    beforeDelete: ((id: string) => Promise<string> | string)[];
    afterDelete: ((id: string) => Promise<void> | void)[];
  } = {
    beforeFind: [],
    afterFind: [],
    beforeCreate: [],
    afterCreate: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeDelete: [],
    afterDelete: [],
  };

  constructor(protected readonly repository: IRepository<TEntity>) { }

  protected async runHooks<T>(
    hooks: ((...args: any[]) => T | Promise<T>)[],
    ...args: any[]
  ): Promise<T> {
    let result = args[0];
    for (const hook of hooks) {
      result = await hook.call(this, ...[result, ...args.slice(1)]);
    }
    return result;
  }

  async find(opts: FilterOptions<TEntity>): Promise<TEntity[]> {
    opts = await this.runHooks(this.hooks.beforeFind, opts);
    let res = await this.repository.find(opts);
    res = await this.runHooks(this.hooks.afterFind, opts, res);
    return res;
  }

  async findByID(id: string): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(input: Partial<TEntity>): Promise<TEntity> {
    input = await this.runHooks(this.hooks.beforeCreate, input);
    let res = await this.repository.create(input);
    res = await this.runHooks(this.hooks.afterCreate, res);
    return res;
  }

  async update(id: string, input: Partial<TEntity>): Promise<void> {
    [id, input] = await this.runHooks(this.hooks.beforeUpdate, id, input);
    await this.repository.update(id, input);
    await this.runHooks(this.hooks.afterUpdate, id, input);
  }

  async delete(id: string): Promise<void> {
    id = await this.runHooks(this.hooks.beforeDelete, id);
    await this.repository.delete(id);
    await this.runHooks(this.hooks.afterDelete, id);
  }
}