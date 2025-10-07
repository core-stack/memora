

import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';
import { ICrudRepository } from './repository.interface';
import { ICrudService } from './service.interface';

export abstract class CrudService<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> implements ICrudService<TEntity, TCreateDto, TUpdateDto> {
  constructor(
    protected readonly repository: ICrudRepository<TEntity, TCreateDto, TUpdateDto>,
  ) { }

  async find(opts: FilterOptions<TEntity>, ctx?: HttpContext): Promise<TEntity[]> {
    let res = await this.repository.find(opts);
    return res;
  }

  async findByID(id: string, ctx?: HttpContext): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(input: TCreateDto, ctx?: HttpContext): Promise<TEntity> {
    let res = await this.repository.create(input as TCreateDto);
    return res;
  }

  async update(id: string, input: TUpdateDto, ctx?: HttpContext): Promise<void> {
    await this.repository.update(id, input as TUpdateDto);
  }

  async delete(id: string, ctx?: HttpContext): Promise<void> {
    await this.repository.delete(id);
  }
}