import { Plugin } from "@memora/schemas";
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

import { PluginProviderRegistry } from "./plugin-provider.service";
import { IPlugin } from "./types/plugin";
import { PluginDefinition, pluginDefinitionSchema } from "./types/plugin-definition";
import { PluginModule } from "./types/plugin-module";

export const PLUGINS_DIR = Symbol('PLUGINS_DIR');

interface PluginInstance {
  instance: IPlugin;
  lastUsed: Date;
  timeoutId?: NodeJS.Timeout;
}

@Injectable()
export class PluginRegistryService implements OnModuleInit {
  private readonly logger = new Logger(PluginRegistryService.name);
  private pluginModules = new Map<string, PluginModule>();
  private pluginInstances = new Map<string, PluginInstance>();

  private _plugins: PluginDefinition[] = [];
  get plugins(): PluginDefinition[] {
    return this._plugins;
  }

  private readonly INSTANCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Inject(PLUGINS_DIR) private readonly pluginsDir: string,
    private providerRegistry: PluginProviderRegistry,
  ) {}

  onModuleInit() {
    this.loadPluginModule();
  }

  async discoverPlugins(): Promise<{ name: string, module: any }[]> {
    if (!this.pluginsDir || !fs.existsSync(this.pluginsDir)) {
      this.logger.warn(`Plugins directory ${this.pluginsDir} does not exist`);
      return [];
    }

    this.logger.log(`Discovering plugins in ${this.pluginsDir}`);
    const pluginDirs = fs.readdirSync(this.pluginsDir);
    const validPlugins: { name: string, module: any }[] = [];

    for (const dir of pluginDirs) {
      const pluginPath = path.join(this.pluginsDir, dir);
      const packageJsonPath = path.join(pluginPath, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          if (packageJson.name && packageJson.main) {
            validPlugins.push({
              name: packageJson.name,
              module: await import(path.join(pluginPath, packageJson.main))
            });
            this._plugins.some(p => p.name === packageJson.name)
            this.logger.log(`Discovered plugin: ${packageJson.name}`);
          }
        } catch (error) {
          this.logger.warn(`Invalid plugin package.json in ${dir}: ${error.message}`);
        }
      }

      const pluginJsonPath = path.join(pluginPath, 'memora-plugin.json');
      if (fs.existsSync(pluginJsonPath)) {
        try {
          const pluginJson = pluginDefinitionSchema.parse(JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8')));
          if (this._plugins.every(p => p.name !== pluginJson.name)) {
            this._plugins.push(pluginJson);
          }
        } catch (error) {
          this.logger.warn(`Invalid plugin.json in ${dir}: ${error.message}`);
        }
      }
    }

    return validPlugins;
  }

  async loadPluginModule(): Promise<void> {
    try {
      const plugins = await this.discoverPlugins();
      for (const { module, name } of plugins) {
        this.pluginModules.set(name, module);
        this.logger.log(`Plugin module ${name} loaded`);
      }
    } catch (error) {
      this.logger.error(`Failed to load plugin module: ${error.message}`);
      throw error;
    }
  }

  async createInstance(p: Plugin): Promise<IPlugin> {
    const pluginModule = this.pluginModules.get(p.type);
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

  async getDefinition(p: Plugin): Promise<PluginDefinition | undefined> {
    return this.plugins.find(plugin => plugin.name === p.type);
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