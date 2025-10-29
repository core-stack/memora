import { inArray } from 'drizzle-orm';

import { plugin } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { CreatePluginEntity, PluginEntity, UpdatePluginEntity } from './plugin.entity';

export class PluginRepository extends DrizzleGenericRepository<
  typeof plugin, PluginEntity, CreatePluginEntity, UpdatePluginEntity
> {
  constructor() {
    super(plugin);
  }

  async findByIDList(idList: string[], repoOpts?: RepositoryOptions<TxType>): Promise<PluginEntity[]> {
    return this.run(async (db) => {
      return db.select().from(plugin).where(inArray(plugin.id, idList));
    }, repoOpts);
  }
}