import { Plugin } from '@memora/schemas';
// src/plugins/manager/plugin-manager.service.ts
import { Injectable, Logger } from '@nestjs/common';

import { PluginFactoryService } from './plugin-factory.service';

interface PluginConfig {
  pluginName: string;
  instanceId: string;
  config: any;
}

@Injectable()
export class PluginManagerService {
  private readonly logger = new Logger(PluginManagerService.name);

  constructor(private pluginFactory: PluginFactoryService) {}

  async executePlugin<T>(p: Plugin, data: any): Promise<T> {
    try {
      const instance = await this.pluginFactory.getOrCreateInstance(p);
      if (typeof instance.execute !== 'function') {
        throw new Error(`Operation "execute" not found in plugin ${p.type}`);
      }

      const result = await instance.execute(data);
      
      return result;
    } catch (error) {
      this.logger.error(`Plugin execution failed: ${error.message}`);
      throw error;
    }
  }

  async preloadPlugins(plugins: Plugin[]): Promise<void> {
    for (const p of plugins) {
      try {
        await this.pluginFactory.getOrCreateInstance(p);
        this.logger.debug(`Preloaded plugin: ${p.id}`);
      } catch (error) {
        this.logger.warn(`Failed to preload plugin ${p.id}: ${error.message}`);
      }
    }
  }

  async cleanupInstance(pluginName: string, instanceId: string): Promise<void> {
    const instanceKey = `${pluginName}:${instanceId}`;

    const instance = this.pluginFactory['pluginInstances'].get(instanceKey);
    if (instance && instance.timeoutId) {
      clearTimeout(instance.timeoutId);
    }
    await this.pluginFactory['cleanupInstance'](instanceKey);
  }
}