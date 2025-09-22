import { HttpContext } from "@/generics/http-context";
import { TenantService } from "@/generics/tenant.service";
import { LLMService } from "@/infra/llm/llm.service";
import { SecurityService } from "@/infra/security/security.service";
import { PluginRegistryService } from "@/plugin-registry/plugin-registry.service";
import { buildConfigObjectSchema, Plugin } from "@memora/schemas";
import { BadRequestException, Injectable } from "@nestjs/common";

import { KnowledgePluginRepository } from "./knowledge-plugin.repository";
import { PluginRepository } from "./plugin.repository";

@Injectable()
export class PluginService extends TenantService<Plugin> {
  constructor(
    repository: PluginRepository,
    private knowledgePluginRepository: KnowledgePluginRepository,
    private llmService: LLMService,
    private pluginRegistryService: PluginRegistryService,
    private securityService: SecurityService
  ) {
    super(repository);
  }

  async getRelevantPlugins(
    query: string,
    knowledgeId: string,
    knowledgeDescription: string
  ): Promise<Plugin[]> {
    const plugins = await this.knowledgePluginRepository.findPluginByKnowledgeId(knowledgeId);
    return this.llmService.decidePluginsToUse(query, knowledgeDescription, plugins);
  }

  override async create(input: Partial<Plugin>, ctx: HttpContext): Promise<Plugin> {
    const registry = await this.pluginRegistryService.getByName(input.pluginRegistry!);
    if (!registry) throw new BadRequestException(`Plugin registry ${input.pluginRegistry} not found`);
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
}
