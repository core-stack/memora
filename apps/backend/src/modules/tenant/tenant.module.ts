import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { TenantController } from "./tenant.controller";
import { TenantRepository } from "./tenant.repository";
import { TenantService } from "./tenant.service";

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  imports: [DatabaseModule]
})
export class TenantModule {}
