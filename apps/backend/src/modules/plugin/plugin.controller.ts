import { CrudController } from "@/generics";
import { createPluginSchema, Plugin, pluginFilterSchema, updatePluginSchema } from "@memora/schemas";
import { Controller, Get } from "@nestjs/common";

import { PluginService } from "./plugin.service";

@Controller('plugin')
export class PluginController extends CrudController<Plugin> {
  constructor(protected service: PluginService) {
    super(service, pluginFilterSchema, createPluginSchema, updatePluginSchema);
  }

  @Get("discover")
  discover() {
    this.service.discover();
  }
}
