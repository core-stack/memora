import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { PluginController } from "./plugin.controller";
import { PluginRepository } from "./plugin.repository";
import { PluginService } from "./plugin.service";

@Module({
  controllers: [PluginController],
  providers: [PluginService, PluginRepository],
  imports: [DatabaseModule],
})
export class PluginModule {}
