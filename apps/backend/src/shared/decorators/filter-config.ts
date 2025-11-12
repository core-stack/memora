import { queryToFilter } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

const FILTER_METADATA_KEY = Symbol('filter_options');

export const ControllerFilterConfig = <TEntity>(config: {
  allowedFilters?: (keyof TEntity)[];
  allowedIncludes?: (keyof TEntity)[];
}) => SetMetadata(FILTER_METADATA_KEY, config);

export const FilterConfig = <TEntity>(config?: {
  allowedFilters?: (keyof TEntity)[];
  allowedIncludes?: (keyof TEntity)[];
}) =>
  createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query as Record<string, unknown>;

    const controller = ctx.getClass();
    const reflector = (Reflect as any);
    const controllerConfig = reflector.getMetadata(FILTER_METADATA_KEY, controller) || {};

    const mergedConfig = {
      allowedFilters: [
        ...(controllerConfig.allowedFilters || []),
        ...(config?.allowedFilters || []),
      ],
      allowedIncludes: [
        ...(controllerConfig.allowedIncludes || []),
        ...(config?.allowedIncludes || []),
      ],
    };

    const options = queryToFilter<TEntity>(query);

    if (mergedConfig.allowedFilters.length && options.filter) {
      for (const key of Object.keys(options.filter)) {
        if (!mergedConfig.allowedFilters.includes(key as keyof TEntity)) {
          delete options.filter[key as keyof TEntity];
        }
      }
    }

    if (mergedConfig.allowedIncludes.length && options.include) {
      options.include = options.include.filter((i) =>
        mergedConfig.allowedIncludes.includes(i as any),
      );
    }

    return options as FilterOptions<TEntity>;
  })();
