import { Request } from 'express';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export class FilterOptions<TEntity> implements FindManyOptions<TEntity> {
  take?: number;
  skip?: number;
  where?: FindOptionsWhere<TEntity>;
  order?: FindOptionsOrder<TEntity>;
  relations?: string[];

  constructor(options: Partial<FilterOptions<TEntity>>) {
    this.take = options.take;
    this.skip = options.skip;
    this.where = options.where;
    this.order = options.order;
    this.relations = options.relations;
  }

  static fromRequest<TEntity>(request: Request): FilterOptions<TEntity> {
    const query = request.query;
    const params = request.params;
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
      if (key === 'limit' || key === 'offset') continue;

      const match = key.match(/^filter\[(.+)\]$/);
      if (match) {
        const field = match[1];
        where[field] = value === 'null' ? null : value;
      }
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        where[key] = value === 'null' ? null : value;
      }
    }

    const order: FindOptionsOrder<TEntity> = {};
    if (query.sort) {
      const fields = (query.sort as string).split(',');
      for (const f of fields) {
        const key = f.startsWith('-') ? f.substring(1) : f;
        const direction = f.startsWith('-') ? 'DESC' : 'ASC';
        (order as any)[key] = direction;
      }
    }

    const relations = query.relations
      ? (query.relations as string).split(',').map(r => r.trim())
      : [];

    return new FilterOptions<TEntity>({
      take: query.limit ? parseInt(query.limit as string) : undefined,
      skip: query.offset ? parseInt(query.offset as string) : undefined,
      where: where as FindOptionsWhere<TEntity>,
      order,
      relations,
    });
  }
}
