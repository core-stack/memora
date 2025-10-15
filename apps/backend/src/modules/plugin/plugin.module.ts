import { DatabaseModule } from '@/infra/database/database.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { SecurityModule } from '@/infra/security/security.module';
import { PluginRegistryModule } from '@/plugin-registry/plugin-registry.module';
import { Module } from '@nestjs/common';

import { KnowledgePluginRepository } from './knowledge-plugin.repository';
import { PluginController } from './plugin.controller';
import { PluginRepository } from './plugin.repository';
import { PluginService } from './plugin.service';

@Module({
  controllers: [PluginController],
  providers: [PluginService, PluginRepository, KnowledgePluginRepository],
  imports: [DatabaseModule, LLMModule, PluginRegistryModule, SecurityModule, PromptModule],
  exports: [PluginService]
})
export class PluginModule {}
