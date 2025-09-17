import { knowledgePlugin, plugin } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { FilterOptions } from "@/generics/filter-options";
import { Plugin } from "@memora/schemas";
import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

@Injectable()
export class PluginRepository extends DrizzleGenericRepository<typeof plugin, Plugin> {
  constructor() {
    super(plugin);
  }

  async findByKnowledgeId(knowledgeId: string, opts: FilterOptions<Plugin> = {}): Promise<Plugin[]> {
    const { filter, order } = this.buildFilter(opts);
    const res = await this.db.select()
      .from(knowledgePlugin)
      .innerJoin(plugin, eq(knowledgePlugin.pluginId, plugin.id))
      .where(
        and(
          eq(knowledgePlugin.knowledgeId, knowledgeId),
          ...filter
        )
      ).orderBy(...order);

    return res.map(r => r.plugin);
  }
}
