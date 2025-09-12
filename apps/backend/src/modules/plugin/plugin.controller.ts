import { CrudController } from '@/generics';
import {
  createPluginSchema, Plugin, pluginFilterSchema, updatePluginSchema
} from '@memora/schemas';
import { Controller } from '@nestjs/common';

import { PluginService } from './plugin.service';

@Controller('plugin')
export class PluginController extends CrudController<Plugin> {
  constructor(service: PluginService) {
    super(
      service,
      pluginFilterSchema,
      createPluginSchema,
      updatePluginSchema
    );
  }
}
