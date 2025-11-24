import { Request } from "express";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from "typeorm";

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

  static fromRequest<TEntity>(
    request: Request,
    allowedFilters: (keyof TEntity)[] = [],
    allowedRelations: (keyof TEntity)[] = []
  ): FilterOptions<TEntity> {
    const query = request.query;
    const params = request.params;
    const where: Record<string, any> = {};

    for (const [ key, value ] of Object.entries(query)) {
      if (key === "limit" || key === "offset" || key === "sort" || key === "relations") continue;

      const match = key.match(/^filter\[(.+)\]$/);
      if (match) {
        const field = match[1] as keyof TEntity;

        if (allowedFilters.length === 0 || allowedFilters.includes(field)) {
          where[field as string] = value === "null" ? null : value;
        }
      }
    }

    if (params) {
      for (const [ key, value ] of Object.entries(params)) {
        where[key] = value;
      }
    }

    const order: FindOptionsOrder<TEntity> = {};
    let orderInQuery: string[] = Array.isArray(query.sort) ?
      query.sort as string[] :
      [ query.sort as string ];

    if (query["sort[]"]) {
      orderInQuery.push(...(
        Array.isArray(query["sort[]"]) ?
          query["sort[]"] as string[] :
          [ query["sort[]"] as string ]
      ));
    }
    orderInQuery = orderInQuery.filter(f => !!f);

    if (orderInQuery) {
      for (const f of orderInQuery) {
        const key = (f.startsWith("-") ? f.substring(1) : f) as keyof TEntity;
        const direction = f.startsWith("-") ? "DESC" : "ASC";
        if (allowedFilters.length === 0 || allowedFilters.includes(key)) {
          (order as any)[key] = direction;
        }
      }
    }

    const relationsInQuery: string[] = Array.isArray(query.relations) ?
      query.relations as string[] :
      [ query.relations as string ];

    if (query["relations[]"]) {
      relationsInQuery.push(...(
        Array.isArray(query["relations[]"]) ?
          query["relations[]"] as string[] :
          [ query["relations[]"] as string ])
      );
    }

    const relations = relationsInQuery
      .filter(relation => allowedRelations.includes(relation as keyof TEntity))
      .filter(relation => !!relation);

    return new FilterOptions<TEntity>({
      take: query.limit ? parseInt(query.limit as string) : undefined,
      skip: query.offset ? parseInt(query.offset as string) : undefined,
      where: where as FindOptionsWhere<TEntity>,
      order,
      relations
    });
  }
}
