import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';
import { ICrudRepository } from './repository.interface';
import { ICrudService } from './service.interface';

export abstract class CrudService<TEntity> implements ICrudService<TEntity> {
  constructor(
    protected readonly repository: ICrudRepository<TEntity>,
  ) { }

  async find(opts: FilterOptions<TEntity>, ctx?: HttpContext): Promise<TEntity[]> {
    let res = await this.repository.find(opts);
    return res;
  }

  async findByID(id: string, ctx?: HttpContext): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(input: Partial<TEntity>, ctx?: HttpContext): Promise<TEntity> {
    let res = await this.repository.create(input);
    return res;
  }

  async update(id: string, input: Partial<TEntity>, ctx?: HttpContext): Promise<void> {
    await this.repository.update(id, input);
  }

  async delete(id: string, ctx?: HttpContext): Promise<void> {
    await this.repository.delete(id);
  }
}