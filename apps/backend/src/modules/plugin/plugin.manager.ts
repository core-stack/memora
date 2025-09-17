import { Plugin } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { plugins } from "./plugins";
import { PluginInstance } from "./plugins/base/plugin";

@Injectable()
export class PluginManager {
  instances: PluginInstance<any>[] = [];

  async loadPlugins(pluginList: Plugin[]) {
    for (const plugin of pluginList) {
      if (this.instances.every((i) => i.id !== plugin.id)) {
        const res = new plugins[plugin.type](plugin.id);
        await res.load(plugin.config);
        this.instances.push(res);
      }
    }
  }

  async runPlugins(pluginList: Plugin[]) {
    for (const plugin of pluginList) {

    }
  }
}