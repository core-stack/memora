import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { TenantController } from "./tenant.controller";
import { TenantRepository } from "./tenant.repository";
import { TenantService } from "./tenant.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  imports: [DatabaseModule, AuthModule]
})
export class TenantModule {}
