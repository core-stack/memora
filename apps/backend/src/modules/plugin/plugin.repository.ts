import { plugin } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Plugin } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PluginRepository extends DrizzleGenericRepository<typeof plugin, Plugin> {
  constructor() {
    super(plugin);
  }
}
