import { Request } from "express";

import { env } from "@/env";
import {
  createParamDecorator, CustomDecorator, ExecutionContext, SetMetadata
} from "@nestjs/common";

import { FilterOptions } from "../../filter-options";

const FILTER_METADATA_KEY = Symbol("filter_options");

export const ControllerFilter = <TEntity>(config: {
  allowedFilters?: (keyof TEntity)[];
  allowedRelations?: (keyof TEntity)[];
}): CustomDecorator<typeof FILTER_METADATA_KEY> => SetMetadata(FILTER_METADATA_KEY, config);

export const Filter = <TEntity>(config?: {
  allowedFilters?: (keyof TEntity)[];
  allowedRelations?: (keyof TEntity)[];
}): ParameterDecorator =>
  createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const controller = ctx.getClass();
    const reflector = (Reflect as any);
    const controllerConfig = reflector.getMetadata(FILTER_METADATA_KEY, controller) || {};

    const mergedConfig = {
      allowedFilters: [
        ...(controllerConfig.allowedFilters || []),
        ...(config?.allowedFilters || [])
      ],
      allowedRelations: [
        ...(controllerConfig.allowedRelations || []),
        ...(config?.allowedRelations || [])
      ]
    };

    const options = FilterOptions.fromRequest<TEntity>(
      request,
      mergedConfig.allowedFilters,
      mergedConfig.allowedRelations
    );

    if (mergedConfig.allowedFilters.length && options.where) {
      for (const key of Object.keys(options.where)) {
        if (!mergedConfig.allowedFilters.includes(key as keyof TEntity)) {
          if (env.NODE_ENV !== "production" && Object.keys(request.params).some((i) => i === key)) {
            console.warn(`The "${key}" filter is not allowed for ${controller.name} controller.`);
          }
          delete options.where[key as any];
        }
      }
    }

    if (mergedConfig.allowedRelations.length && options.relations) {
      options.relations = options.relations.filter((i) =>
        mergedConfig.allowedRelations.includes(i as any)
      );
    }

    return options;
  })();
