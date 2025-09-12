import { CrudService } from '@/generics';
import { Plugin } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { PluginRepository } from './plugin.repository';

@Injectable()
export class PluginService extends CrudService<Plugin> {
  constructor(repository: PluginRepository) {
    super(repository);
  }
}
