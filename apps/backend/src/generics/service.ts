import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';
import { ICrudRepository } from './repository.interface';
import { ICrudService } from './service.interface';

export abstract class CrudService<
  TSchema,
  TCreateDto = Partial<TSchema>,
  TUpdateDto = Partial<TSchema>,
  TEntity = TSchema
> implements ICrudService<TSchema, TCreateDto, TUpdateDto> {
  constructor(
    protected readonly repository: ICrudRepository<TEntity, TCreateDto, TUpdateDto>,
  ) { }

  async find(opts: FilterOptions<TSchema>, ctx?: HttpContext): Promise<TSchema[]> {
    return this.toSchema(await this.repository.find(opts as FilterOptions<TEntity>)) as TSchema[];
  }

  async findByID(id: string, ctx?: HttpContext): Promise<TSchema | null> {
    return this.toSchema(await this.repository.findByID(id));
  }

  async create(input: TCreateDto, ctx?: HttpContext): Promise<TSchema> {
    return this.toSchema(await this.repository.create(input as TCreateDto));
  }

  async update(id: string, input: TUpdateDto, ctx?: HttpContext): Promise<void> {
    await this.repository.update(id, input as TUpdateDto);
  }

  async delete(id: string, ctx?: HttpContext): Promise<void> {
    await this.repository.delete(id);
  }

  toSchema<T = TEntity>(entity: T): TSchema
  toSchema<T = TEntity>(entity: T[]): TSchema[]
  toSchema<T = TEntity>(entity: T | T[]): TSchema | TSchema[] {
    if (Array.isArray(entity)) return entity.map(e => e as unknown as TSchema);
    return entity as unknown as TSchema;
  }
}