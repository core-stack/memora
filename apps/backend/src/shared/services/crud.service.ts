import { FilterOptions } from "@/generics/filter-options";
import { FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import { Dto } from "../dto";
import { Constructor } from "@/@types/constructor";

export abstract class CrudService<
  TEntity extends ObjectLiteral,
  TDto extends Dto<TEntity>,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>
> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    private readonly dtoClass: new () => TDto,
    private readonly idField: keyof TEntity = "id"
  ) {}

  async find(filterOptions: FilterOptions<TEntity>): Promise<TDto[]> {
    return this.toDTO(
      await this.repository.find({
        take: filterOptions.limit,
        skip: filterOptions.offset,
        order: filterOptions.order as any,
        relations: filterOptions.include as any,
        where: filterOptions.filter as any
      })
    );
  }

  async findUnique(filterOptions: FilterOptions<TEntity>): Promise<TDto | null> {
    return this.toDTO(
      await this.repository.findOneOrFail({
        order: filterOptions.order as any,
        relations: filterOptions.include as any,
        where: filterOptions.filter as any
      })
    );
  }

  async findFirst(filterOptions: FilterOptions<TEntity>): Promise<TDto | null> {
    return this.toDTO(
      (await this.repository.find({
        take: 1,
        skip: 0,
        order: filterOptions.order as any,
        relations: filterOptions.include as any,
        where: filterOptions.filter as any
      }))[0]
    );
  }

  async findByID(id: string): Promise<TDto | null> {
    return this.toDTO(
      (await this.repository.findBy({ [this.idField]: id } as FindOptionsWhere<TEntity>))[0]
    );
  }

  async create(input: TCreateDto): Promise<TDto> {
    return this.toDTO(await this.repository.save(input as any));
  }

  async update(id: string, input: TUpdateDto): Promise<void> {
    await this.repository.update(id, input as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  protected toDTO(entity: null): null;
  protected toDTO(entity: TEntity): TDto;
  protected toDTO(entity: TEntity[]): TDto[];
  protected toDTO(entity: TEntity | TEntity[] | null): TDto | TDto[] | null {
    if (!entity) return null;
    const dto = new this.dtoClass();
    return dto.fromEntity(entity) as TDto | TDto[];
  }
}