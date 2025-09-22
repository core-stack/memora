import { LLMService } from "@/infra/llm/llm.service";
import { Plugin } from "@memora/schemas";
import { Injectable, Logger } from "@nestjs/common";

import { PluginRegistryService } from "./plugin-registry.service";
import { buildInputObjectSchema } from "./utils/plugin-schema-builder";

@Injectable()
export class PluginManagerService {
  private readonly logger = new Logger(PluginManagerService.name);

  constructor(private pluginRegistry: PluginRegistryService, private llmService: LLMService) {}

  async executePlugin<T>(p: Plugin, data: any): Promise<T> {
    try {
      const instance = await this.pluginRegistry.getOrCreateInstance(p);
      if (typeof instance.execute !== 'function') {
        throw new Error(`Operation "execute" not found in plugin ${p.type}`);
      }

      return instance.execute(data);
    } catch (error) {
      this.logger.error(`Plugin execution failed: ${error.message}`);
      throw error;
    }
  }

  async executeFromQuery<T>(p: Plugin, query: string): Promise<T> {
    try {
      const def = await this.pluginRegistry.getDefinition(p);
      if (!def) throw new Error(`Plugin ${p.type} not found`);
      const schema = buildInputObjectSchema(def.inputSchema);
      const result = await this.llmService.withStructuredOutput(query, schema);
      return this.executePlugin<T>(p, result);
    } catch (error) {
      this.logger.error(`Plugin execution failed: ${error.message}`);
      throw error;
    }
  }

  async preloadPlugins(plugins: Plugin[]): Promise<void> {
    for (const p of plugins) {
      try {
        await this.pluginRegistry.getOrCreateInstance(p);
        this.logger.debug(`Preloaded plugin: ${p.id}`);
      } catch (error) {
        this.logger.warn(`Failed to preload plugin ${p.id}: ${error.message}`);
      }
    }
  }
}