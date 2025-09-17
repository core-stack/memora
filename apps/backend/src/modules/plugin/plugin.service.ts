import { CrudService } from "@/generics";
import { Plugin } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { KnowledgePluginRepository } from "./knowledge-plugin.repository";
import { PluginManager } from "./plugin.manager";
import { PluginRepository } from "./plugin.repository";

@Injectable()
export class PluginService extends CrudService<Plugin> {
  constructor(
    protected repository: PluginRepository,
    private readonly knowledgePluginRepository: KnowledgePluginRepository,
    private readonly pluginManager: PluginManager
  ) {
    super(repository);
  }

  async searchInPlugins(knowledgeId: string, query: string) {
    const plugins = await this.repository.findByKnowledgeId(knowledgeId);

    // TODO: determine plugins to use

    await this.pluginManager.loadPlugins(plugins);


  }
}
