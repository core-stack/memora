import { DatabaseModule } from "@/infra/database/database.module";
import { EmailModule } from "@/jobs/email/email.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { MemberModule } from "../member/member.module";
import { RoleModule } from "../role/role.module";
import { TenantModule } from "../tenant/tenant.module";
import { UserModule } from "../user/user.module";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";

@Module({
  controllers: [ InviteController ],
  providers: [ InviteService ],
  imports: [ DatabaseModule, RoleModule, MemberModule, TenantModule, EmailModule, UserModule, HTTPContextModule ]
})
export class InviteModule {}
