import { Controller, Get } from "@nestjs/common";

import { PluginRegistryService } from "./plugin-registry.service";

@Controller("plugin-registry")
export class PluginRegistryController {
  constructor(private readonly pluginRegistryService: PluginRegistryService) {}

  @Get()
  async get() {
    return this.pluginRegistryService.plugins.map(({ inputSchema, ...p }) => p);
  }
}