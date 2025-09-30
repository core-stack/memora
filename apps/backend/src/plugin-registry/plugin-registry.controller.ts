import { ZodQuery } from "@/shared/decorators/zod-query";
import { pluginRegistryFilterSchema } from "@memora/schemas";
import { Controller, Get } from "@nestjs/common";

import { PluginRegistryService } from "./plugin-registry.service";

import type { PluginRegistryFilter } from "@memora/schemas";

@Controller("plugin-registry")
export class PluginRegistryController {
  constructor(private readonly pluginRegistryService: PluginRegistryService) {}

  @Get()
  async get(@ZodQuery(pluginRegistryFilterSchema) query: PluginRegistryFilter) {
    const allPlugins = this.pluginRegistryService.plugins.map(({ inputSchema, ...p }) => p);
    let filteredPliguins = allPlugins;
    if (query.filter?.type) {
      filteredPliguins = filteredPliguins.filter(p => p.type === query.filter?.type);
    }
    if (query.filter?.name) {
      filteredPliguins = filteredPliguins.filter(p => p.name === query.filter?.name);
    }

    if (query.limit && query.offset) {
      filteredPliguins = filteredPliguins.slice(
        query.offset * query.limit,
        query.offset * query.limit + query.limit
      );
    } else if (query.limit) {
      filteredPliguins = filteredPliguins.slice(0, query.limit);
    }
    return filteredPliguins;
  }
}