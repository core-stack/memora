import { eq } from 'drizzle-orm';

import { knowledgePlugin, plugin } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { KnowledgePluginEntity } from './knowledge-plugin.entity';
import { PluginEntity } from './plugin.entity';

export class KnowledgePluginRepository extends DrizzleGenericRepository<
  typeof knowledgePlugin, KnowledgePluginEntity
> {
  constructor() {
    super(knowledgePlugin);
  }

  async findPluginByKnowledgeId(knowledgeId: string): Promise<PluginEntity[]> {
    const res = await this.db.select()
      .from(knowledgePlugin)
      .where(eq(knowledgePlugin.knowledgeId, knowledgeId))
      .leftJoin(plugin, eq(knowledgePlugin.pluginId, plugin.id));

    if (res.length === 0) return [];
    return res.map((item) => item.plugin as PluginEntity);
  }
}