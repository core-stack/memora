import type { Request } from 'express';

import { CrudController } from '@/generics';
import { ZodBody } from '@/shared/decorators/zod-body';
import {
  createPluginSchema, Plugin, pluginFilterSchema, updatePluginSchema
} from '@memora/schemas';
import { Controller, Post } from '@nestjs/common';

import { PluginService } from './plugin.service';

import type { CreatePlugin } from "@memora/schemas";
@Controller('plugin')
export class PluginController extends CrudController<Plugin> {
  constructor(protected service: PluginService) {
    super(service, pluginFilterSchema, createPluginSchema, updatePluginSchema);
  }

  @Post("test")
  test(@ZodBody(createPluginSchema) plugin: CreatePlugin) {
    return this.service.test(plugin);
  }
}
