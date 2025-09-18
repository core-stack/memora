import { CrudService } from "@/generics";
import { FilterOptions } from "@/generics/filter-options";
import { HttpContext } from "@/generics/http-context";
import { PluginFactoryService } from "@/plugin-registry/plugin-factory.service";
import { PluginManagerService } from "@/plugin-registry/plugin-manager.service";
import { Plugin } from "@memora/schemas";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

import { PluginRepository } from "./plugin.repository";

@Injectable()
export class PluginService extends CrudService<Plugin> {
  constructor(
    repository: PluginRepository,
    private pluginManager: PluginManagerService,
    private pluginFactory: PluginFactoryService
  ) {
    super(repository);
  }

  override async find(opts: FilterOptions<Plugin>, ctx: HttpContext): Promise<Plugin[]> {
    this.pluginManager.executePlugin({
      id: randomUUID(),
      type: "postgres",
      createdAt: new Date(),
      updatedAt: new Date(),
      description: "",
      name: "",
      tenantId: "",
      whenUse: "",
      config: {
        host: "localhost",
        port: 5432,
        database: "memora",
        user: "postgres",
        password: "postgres",
      }
    }, { query: "teste" })
    return [];
  }

  async discover() {
    this.pluginFactory.loadPluginModule();
  }

}
