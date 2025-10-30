import { HttpContext } from '@/generics/http-context';
import { LLMService } from '@/infra/llm/llm.service';
import { PromptService } from '@/infra/prompt/prompt.service';
import { SecurityService } from '@/infra/security/security.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { PluginRegistryWithInput } from '@/plugin-registry/plugin-registry';
import { PluginRegistryService } from '@/plugin-registry/plugin-registry.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { buildConfigObjectSchema, CreatePlugin, Plugin, UpdatePlugin } from '@snipet/schemas';

import { KnowledgePluginRepository } from './knowledge-plugin.repository';
import { PluginRepository } from './plugin.repository';
import { CrudService } from '@/generics';
import { ServiceOptions } from '@/generics/service.interface';
import { CreatePluginEntity, PluginEntity, UpdatePluginEntity } from './plugin.entity';

@Injectable()
export class PluginService extends CrudService<
  Plugin, CreatePlugin, UpdatePlugin,
  PluginEntity, CreatePluginEntity, UpdatePluginEntity
> {
  constructor(
    protected repository: PluginRepository,
    private readonly knowledgePluginRepository: KnowledgePluginRepository,
    private readonly llmService: LLMService,
    private readonly pluginRegistryService: PluginRegistryService,
    private readonly pluginManagerService: PluginManagerService,
    private readonly securityService: SecurityService,
    private readonly promptService: PromptService
  ) {
    super(repository);
  }

  async findByIDList(idList: string[]): Promise<Plugin[]> {
    return this.repository.findByIDList(idList);
  }

  async getRelevantPlugins(
    query: string,
    knowledgeId: string,
    knowledgeInstructions?: string
  ): Promise<Plugin[]> {
    const plugins = await this.knowledgePluginRepository.findPluginByKnowledgeId(knowledgeId);
    if (!plugins.length) return [];
    const prompt = this.promptService.getTemplate("DecidePluginsToUse").build({
      plugins,
      query,
      knowledgeInstructions
    })
    return this.llmService.query(prompt);
  }

  async findRegistry(input: Partial<Plugin>): Promise<PluginRegistryWithInput> {
    const registry = await this.pluginRegistryService.getByName(input.pluginRegistry!);
    if (!registry) throw new BadRequestException(`Plugin registry ${input.pluginRegistry} not found`);
    return registry;
  }

  override async create(input: CreatePlugin, opts: ServiceOptions): Promise<Plugin> {
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

    return super.create(input, opts);
  }

  async test(input: Partial<Plugin>): Promise<boolean> {
    return this.pluginManagerService.testPlugin(input);
  }
}
