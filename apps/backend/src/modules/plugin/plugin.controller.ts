import type { Request } from 'express';

import { CrudController } from '@/generics';
import { ZodBody } from '@/shared/decorators/zod-body';
import { Controller, Post } from '@nestjs/common';
import {
  createPluginSchema, Plugin, pluginFilterSchema, updatePluginSchema
} from '@snipet/schemas';

import { PluginService } from './plugin.service';

import type { CreatePlugin } from "@snipet/schemas";
@Controller('plugin')
export class PluginController
  extends CrudController<Plugin>(pluginFilterSchema, createPluginSchema, updatePluginSchema) {
  constructor(public service: PluginService) {
    super(service);
  }

  @Post("test")
  test(@ZodBody(createPluginSchema) plugin: CreatePlugin) {
    return this.service.test(plugin);
  }
}
