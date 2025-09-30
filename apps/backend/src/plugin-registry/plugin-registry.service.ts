import * as fs from 'fs';
import * as path from 'path';

import { env } from '@/env';
import { StorageService } from '@/infra/storage/storage.service';
import { Plugin } from '@memora/schemas';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PluginProviderRegistry } from './plugin-provider.service';
import { PluginRegistryWithInput, pluginRegistryWithInputSchema } from './plugin-registry';
import { IPlugin } from './types/plugin';
import { PluginModule } from './types/plugin-module';

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

  private _plugins: PluginRegistryWithInput[] = [];
  get plugins(): PluginRegistryWithInput[] {
    return this._plugins;
  }

  private readonly INSTANCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Inject(PLUGINS_DIR) private readonly pluginsDir: string,
    private providerRegistry: PluginProviderRegistry,
    private storage: StorageService
  ) {}

  onModuleInit() {
    this.loadPluginModule();
  }

  async getByName(name: string): Promise<PluginRegistryWithInput | undefined> {
    return this.plugins.find(plugin => plugin.name === name);
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

      // Check for package.json
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

      let newPlugin = false;
      let pluginJson: PluginRegistryWithInput | undefined;
      // Check for memora-plugin.json
      const pluginJsonPath = path.join(pluginPath, 'memora-plugin.json');
      if (fs.existsSync(pluginJsonPath)) {
        try {
          pluginJson = pluginRegistryWithInputSchema.parse(JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8')));
          if (this._plugins.every(p => p.name !== pluginJson?.name)) {
            newPlugin = true;
            this._plugins.push(pluginJson);
          }
        } catch (error) {
          this.logger.warn(`Invalid plugin.json in ${dir}: ${error.message}`);
        }
      }
      if (newPlugin && pluginJson) {
        let loadIcon = false;
        // Check for icon
        const extensions = ['png', 'jpg', 'jpeg', 'svg'];
        if (pluginJson.iconPath) {
          const ext = pluginJson.iconPath.split('.').pop();
          const iconPath = path.join(pluginPath, pluginJson.iconPath);
          if (fs.existsSync(iconPath)) {
            await this.storage.putObject(
              `${pluginJson.name}/icon.${ext}`,
              fs.readFileSync(iconPath),
              `image/${ext}`,
              { bucket: env.PLUGINS_BUCKET }
            );
            loadIcon = true;
            continue;
          }
        }
        for (const ext of extensions) {
          const iconPath = path.join(pluginPath, `icon.${ext}`);
          if (fs.existsSync(iconPath)) {
            await this.storage.putObject(
              `${pluginJson.name}/icon.${ext}`,
              fs.readFileSync(iconPath),
              `image/${ext}`,
              { bucket: env.PLUGINS_BUCKET }
            );
            loadIcon = true;
            break;
          }
        }
        if (!loadIcon) this.logger.warn(`No icon found for ${pluginJson.name}`);

        let loadDocumentation = false;
        // Check for documentation
        if (pluginJson.documentationPath) {
          const documentationPath = path.join(pluginPath, pluginJson.documentationPath);
          if (fs.existsSync(documentationPath)) {
            await this.storage.putObject(
              `${pluginJson.name}/documentation.md`,
              fs.readFileSync(documentationPath),
              'text/markdown',
              { bucket: env.PLUGINS_BUCKET }
            );
            loadDocumentation = true;
            continue;
          }
        }
        const docNames = ['docs.md', 'docs.txt', 'documentation.md', 'documentation.txt', 'readme.md', 'readme.txt'];
        for (const docName of docNames) {
          const iconPath = path.join(pluginPath, docName);
          if (fs.existsSync(iconPath)) {
            await this.storage.putObject(
              `${pluginJson.name}/${docName}`,
              fs.readFileSync(iconPath),
              `text/markdown`,
              { bucket: env.PLUGINS_BUCKET }
            );
            loadDocumentation = true;
            break;
          }
        }
        if (!loadDocumentation) this.logger.warn(`No documentation found for ${pluginJson.name}`);
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

  async createInstance(p: Plugin | Partial<Plugin>, temp: boolean = false): Promise<IPlugin> {    
    if (!p.pluginRegistry) throw new Error(`Plugin registry not provided`);
    console.log(this.pluginModules);
    
    const pluginModule = this.pluginModules.get(p.pluginRegistry);
    if (!pluginModule) throw new Error(`Plugin ${p.pluginRegistry} not loaded`);

    try {
      const instance = await pluginModule.initialize({
        provider: this.providerRegistry,
        config: p.config
      });
      if (temp) return instance;

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

  async getDefinition(p: Plugin): Promise<PluginRegistryWithInput | undefined> {
    return this.plugins.find(plugin => plugin.name === p.type);
  }

  private getInstanceKey(p: Plugin | Partial<Plugin>): string {
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