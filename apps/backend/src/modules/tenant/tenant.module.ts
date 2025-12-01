import { DatabaseModule } from "@/infra/database/database.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TenantEntity } from "../../entities/tenant.entity";
import { AuthModule } from "../auth/auth.module";
import { MemberModule } from "../member/member.module";
import { RoleModule } from "../role/role.module";
import { TenantController } from "./tenant.controller";
import { TenantService } from "./tenant.service";
import { LLMModule } from "../llm/llm.module";

@Module({
  controllers: [ TenantController ],
  providers: [ TenantService ],
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([ TenantEntity ]),
    HTTPContextModule,
    MemberModule,
    forwardRef(() => LLMModule),
    RoleModule
  ],
  exports: [ TenantService ]
})
export class TenantModule {}
