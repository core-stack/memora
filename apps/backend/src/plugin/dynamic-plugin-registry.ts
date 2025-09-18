import * as fs from 'fs';
import * as path from 'path';

import { Inject, Injectable, Logger } from '@nestjs/common';

export const PLUGINS_DIR = Symbol("plugins-dir");

@Injectable()
export class DynamicPluginRegistry {
  private readonly logger = new Logger(DynamicPluginRegistry.name);
  
  constructor(@Inject(PLUGINS_DIR) private readonly pluginsDir: string) {}

  async discoverPlugins(): Promise<{ name: string, definition: any }[]> {    
    if (!this.pluginsDir || !fs.existsSync(this.pluginsDir)) {
      this.logger.warn(`Plugins directory ${this.pluginsDir} does not exist`);
      return [];
    }

    this.logger.log(`Discovering plugins in ${this.pluginsDir}`);
    const pluginDirs = fs.readdirSync(this.pluginsDir);
    const validPlugins: { name: string, definition: any }[] = [];

    for (const dir of pluginDirs) {
      const pluginPath = path.join(this.pluginsDir, dir);
      const packageJsonPath = path.join(pluginPath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          if (packageJson.name && packageJson.main) {
            validPlugins.push({
              name: packageJson.name,
              definition: await import(path.join(pluginPath, packageJson.main))
            });
            this.logger.log(`Discovered plugin: ${packageJson.name}`);
          }
        } catch (error) {
          this.logger.warn(`Invalid plugin package.json in ${dir}: ${error.message}`);
        }
      }
    }

    return validPlugins;
  }

  getPluginPath(pluginName: string): string {
    return path.join(this.pluginsDir, pluginName);
  }
}