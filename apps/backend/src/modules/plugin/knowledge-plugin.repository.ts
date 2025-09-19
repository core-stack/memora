import { eq } from 'drizzle-orm';

import { knowledgePlugin, plugin } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { KnowledgePlugin, Plugin } from '@memora/schemas';

export class KnowledgePluginRepository extends DrizzleGenericRepository<typeof knowledgePlugin, KnowledgePlugin> {
  constructor() {
    super(knowledgePlugin);
  }

  async findPluginByKnowledgeId(knowledgeId: string): Promise<Plugin[]> {
    const res = await this.db.select()
      .from(knowledgePlugin)
      .where(eq(knowledgePlugin.knowledgeId, knowledgeId))
      .leftJoin(plugin, eq(knowledgePlugin.pluginId, plugin.id));
    
    return res.map((item) => item.plugin as Plugin);
  }
}