import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';
import { ICrudRepository } from './repository.interface';
import { ICrudService, ServiceOptions } from './service.interface';

export abstract class CrudService<
  TSchema,
  TCreateDto = Partial<TSchema>,
  TUpdateDto = Partial<TSchema>,
  TEntity = TSchema,
  TCreateEntity = TCreateDto,
  TUpdateEntity = TUpdateDto
> implements ICrudService<TSchema, TCreateDto, TUpdateDto> {
  constructor(
    protected readonly repository: ICrudRepository<TEntity, TCreateEntity, TUpdateEntity>,
  ) { }

  async find(filterOptions: FilterOptions<TSchema>, opts?: ServiceOptions): Promise<TSchema[]> {
    return this.toSchema(
      await this.repository.find(filterOptions as FilterOptions<TEntity>, { tx: opts?.tx })
    ) as TSchema[];
  }

  async findByID(id: string, opts?: ServiceOptions): Promise<TSchema | null> {
    return this.toSchema(await this.repository.findByID(id, { tx: opts?.tx }));
  }

  async create(input: TCreateDto | TCreateEntity, opts?: ServiceOptions): Promise<TSchema> {
    return this.toSchema(await this.repository.create(input as unknown as TCreateEntity, { tx: opts?.tx }));
  }

  async update(id: string, input: TUpdateDto | TUpdateEntity, opts?: ServiceOptions): Promise<void> {
    await this.repository.update(id, input as unknown as TUpdateEntity, { tx: opts?.tx });
  }

  async delete(id: string, opts?: ServiceOptions): Promise<void> {
    await this.repository.delete(id, { tx: opts?.tx });
  }

  toSchema<T = TEntity>(entity: T): TSchema
  toSchema<T = TEntity>(entity: T[]): TSchema[]
  toSchema<T = TEntity>(entity: T | T[]): TSchema | TSchema[] {
    if (Array.isArray(entity)) return entity.map(e => e as unknown as TSchema);
    return entity as unknown as TSchema;
  }
}