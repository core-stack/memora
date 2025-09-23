import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { LLMService } from '@/infra/llm/llm.service';
import { SecurityService } from '@/infra/security/security.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { PluginRegistryWithInput } from '@/plugin-registry/plugin-registry';
import { PluginRegistryService } from '@/plugin-registry/plugin-registry.service';
import { buildConfigObjectSchema, Plugin } from '@memora/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';

import { KnowledgePluginRepository } from './knowledge-plugin.repository';
import { PluginRepository } from './plugin.repository';

@Injectable()
export class PluginService extends TenantService<Plugin> {
  constructor(
    protected repository: PluginRepository,
    private knowledgePluginRepository: KnowledgePluginRepository,
    private llmService: LLMService,
    private pluginRegistryService: PluginRegistryService,
    private pluginManagerService: PluginManagerService,
    private securityService: SecurityService
  ) {
    super(repository);
  }

  async findByIDList(idList: string[]): Promise<Plugin[]> {
    return this.repository.findByIDList(idList);
  }

  async getRelevantPlugins(
    query: string,
    knowledgeId: string,
    knowledgeDescription: string
  ): Promise<Plugin[]> {
    const plugins = await this.knowledgePluginRepository.findPluginByKnowledgeId(knowledgeId);
    return this.llmService.decidePluginsToUse(query, knowledgeDescription, plugins);
  }

  async findRegistry(input: Partial<Plugin>): Promise<PluginRegistryWithInput> {
    const registry = await this.pluginRegistryService.getByName(input.pluginRegistry!);
    if (!registry) throw new BadRequestException(`Plugin registry ${input.pluginRegistry} not found`);
    return registry;
  }
  
  override async create(input: Partial<Plugin>, ctx: HttpContext): Promise<Plugin> {
    const registry = await this.findRegistry(input);
    if (registry.configSchema) {
      try {
        const schema = buildConfigObjectSchema(registry.configSchema!);
        schema.parse(input.config);
      } catch (error) {
        throw new BadRequestException((error as Error).message);
      }
      await Promise.all(Object.entries(registry.configSchema!).map(async ([key, value]) => {
        const isSecret = value.type === "secret-string" || value.type === "secret-number";
        if (isSecret) {
          const res = await this.securityService.encrypt(input.config[key], "password");
          input.config[key] = res;
        }
      }));
    }

    return super.create(input, ctx);
  }

  async test(input: Partial<Plugin>): Promise<boolean> {
    return this.pluginManagerService.testPlugin(input);
  }
}
