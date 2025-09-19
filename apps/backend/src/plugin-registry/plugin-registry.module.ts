import { LLMModule } from "@/infra/llm/llm.module";
import { DynamicModule, Module, OnApplicationShutdown } from "@nestjs/common";

import { PluginManagerService } from "./plugin-manager.service";
import { PluginProviderRegistry } from "./plugin-provider.service";
import { PluginRegistryController } from "./plugin-registry.controller";
import { PluginRegistryService, PLUGINS_DIR } from "./plugin-registry.service";
import { PluginSchemaBuilderService } from "./plugin-schema-builder.service";

@Module({})
export class PluginRegistryModule implements OnApplicationShutdown {
  static forRoot(pluginDir: string): DynamicModule {
    return {
      module: PluginRegistryModule,
      providers: [
        PluginRegistryService,
        PluginManagerService,
        PluginProviderRegistry,
        PluginSchemaBuilderService,
        { provide: PLUGINS_DIR, useValue: pluginDir }
      ],
      imports: [ LLMModule ],
      controllers: [PluginRegistryController],
      global: true,
      exports: [PluginManagerService, PluginRegistryService, PluginProviderRegistry],
    }
  }

  constructor(private readonly pluginFactory: PluginRegistryService) {}

  onApplicationShutdown() {
    return this.pluginFactory.cleanupAllInstances();
  }
}
