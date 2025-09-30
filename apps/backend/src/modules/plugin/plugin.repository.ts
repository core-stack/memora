import { inArray } from 'drizzle-orm';

import { plugin } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Plugin } from '@memora/schemas';

export class PluginRepository extends DrizzleGenericRepository<typeof plugin, Plugin> {
  constructor() {
    super(plugin);
  }


  async findByIDList(idList: string[]): Promise<Plugin[]> {
    return this.db.select().from(plugin).where(inArray(plugin.id, idList));
  }
}