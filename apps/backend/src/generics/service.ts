



import { Context } from "./context";
import { FilterOptions } from "./filter-options";
import { ICrudRepository } from "./repository.interface";
import { ICrudService } from "./service.interface";

export abstract class CrudService<TEntity> implements ICrudService<TEntity> {
  constructor(
    protected readonly repository: ICrudRepository<TEntity>,
  ) { }

  async find(opts: FilterOptions<TEntity>, ctx: Context): Promise<TEntity[]> {
    let res = await this.repository.find(opts);
    return res;
  }

  async findByID(id: string, ctx: Context): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(input: Partial<TEntity>, ctx: Context): Promise<TEntity> {
    let res = await this.repository.create(input);
    return res;
  }

  async update(id: string, input: Partial<TEntity>, ctx: Context): Promise<void> {
    await this.repository.update(id, input);
  }

  async delete(id: string, ctx: Context): Promise<void> {
    await this.repository.delete(id);
  }
}