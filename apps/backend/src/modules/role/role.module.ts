import { DatabaseModule } from "@/infra/database/database.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  controllers: [ RoleController ],
  providers: [ RoleService ],
  imports: [ DatabaseModule, HTTPContextModule ],
  exports: [ RoleService ]
})
export class RoleModule {}
