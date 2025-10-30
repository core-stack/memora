import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { RoleController } from "./role.controller";
import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  imports: [DatabaseModule]
})
export class RoleModule {}
