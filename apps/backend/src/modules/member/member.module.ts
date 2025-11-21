import { DatabaseModule } from "@/infra/database/database.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";

@Module({
  controllers: [ MemberController ],
  providers: [ MemberService ],
  imports: [ DatabaseModule, HTTPContextModule ],
  exports: [ MemberService ]
})
export class MemberModule {}
