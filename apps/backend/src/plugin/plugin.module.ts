import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';

import { DynamicPluginRegistry, PLUGINS_DIR } from './dynamic-plugin-registry';
import { PluginFactoryService } from './plugin-factory.service';
import { PluginManagerService } from './plugin-manager.service';
import { PluginProviderRegistry } from './plugin-provider.service';

@Module({})
export class PluginModule implements OnApplicationShutdown {
  static forRoot(pluginDir: string): DynamicModule {
    return {
      module: PluginModule,
      providers: [
        PluginFactoryService,
        PluginManagerService,
        PluginProviderRegistry,
        DynamicPluginRegistry,
        { provide: PLUGINS_DIR, useValue: pluginDir }
      ],
      global: true,
      exports: [PluginManagerService, PluginFactoryService, PluginProviderRegistry],
    }
  }

  constructor(private readonly pluginFactory: PluginFactoryService) {}
  
  onApplicationShutdown() {
    return this.pluginFactory.cleanupAllInstances();
  }
}
