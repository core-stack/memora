import { Plugin } from '@memora/schemas';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { DynamicPluginRegistry } from './dynamic-plugin-registry';
import { PluginProviderRegistry } from './plugin-provider.service';
import { IPlugin } from './types/plugin';
import { PluginDefinition } from './types/plugin-definition';

interface PluginInstance<T = any> {
  instance: IPlugin;
  lastUsed: Date;
  timeoutId?: NodeJS.Timeout;
}

@Injectable()
export class PluginFactoryService implements OnModuleInit {
  private readonly logger = new Logger(PluginFactoryService.name);
  private pluginDefinitions = new Map<string, PluginDefinition>();
  private pluginInstances = new Map<string, PluginInstance>();
  private readonly INSTANCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(
    private providerRegistry: PluginProviderRegistry,
    private registry: DynamicPluginRegistry
  ) {}

  onModuleInit() {
    this.loadPluginModule();
  }
  
  async loadPluginModule(): Promise<void> {
    try {
      const plugins = await this.registry.discoverPlugins();
      for (const { definition, name } of plugins) {
        this.pluginDefinitions.set(name, definition);
        this.logger.log(`Plugin module ${name} loaded`);
      }
    } catch (error) {
      this.logger.error(`Failed to load plugin module: ${error.message}`);
      throw error;
    }
  }

  async createInstance(p: Plugin): Promise<IPlugin> {
    const pluginModule = this.pluginDefinitions.get(p.type);
    if (!pluginModule) throw new Error(`Plugin ${p.type} not loaded`);

    try {
      const instance = await pluginModule.initialize({
        logger: new Logger(p.type),
        provider: this.providerRegistry,
        config: p.config
      });

      const instanceKey = this.getInstanceKey(p);
      
      this.pluginInstances.set(instanceKey, { instance, lastUsed: new Date() });

      this.scheduleCleanup(instanceKey);
      return instance;
    } catch (error) {
      this.logger.error(`Failed to create instance of ${p.type}: ${error.message}`);
      throw error;
    }
  }

  async getOrCreateInstance(p: Plugin): Promise<IPlugin> {
    const instanceKey = this.getInstanceKey(p);
    const existingInstance = this.pluginInstances.get(instanceKey);

    if (existingInstance) {
      existingInstance.lastUsed = new Date();
      this.logger.debug(`Reusing existing instance: ${instanceKey}`);
      return existingInstance.instance;
    }

    return this.createInstance(p);
  }

  private getInstanceKey(p: Plugin): string {
    return `${p.type}:${p.id}`;
  }

  private scheduleCleanup(instanceKey: string): void {
    const instance = this.pluginInstances.get(instanceKey);
    if (!instance) return;

    
    if (instance.timeoutId) {
      clearTimeout(instance.timeoutId);
    }

    instance.timeoutId = setTimeout(() => {
      this.cleanupInstance(instanceKey);
    }, this.INSTANCE_TIMEOUT);
  }

  private async cleanupInstance(instanceKey: string): Promise<void> {
    const instanceData = this.pluginInstances.get(instanceKey);
    if (!instanceData) return;

    const now = new Date();
    const timeSinceLastUse = now.getTime() - instanceData.lastUsed.getTime();

    if (timeSinceLastUse >= this.INSTANCE_TIMEOUT) {
      try {
        if (instanceData.instance.dispose && typeof instanceData.instance.dispose === 'function') {
          await instanceData.instance.dispose();
        }
        
        this.pluginInstances.delete(instanceKey);
        this.logger.log(`Instance ${instanceKey} cleaned up`);
      } catch (error) {
        this.logger.error(`Error cleaning up instance ${instanceKey}: ${error.message}`);
      }
    }
  }

  async cleanupAllInstances(): Promise<void> {
    for (const [instanceKey] of this.pluginInstances) {
      await this.cleanupInstance(instanceKey);
    }
  }

  getActiveInstancesCount(): number {
    return this.pluginInstances.size;
  }
}