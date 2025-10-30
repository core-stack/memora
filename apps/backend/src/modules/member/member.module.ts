import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { MemberController } from "./member.controller";
import { MemberRepository } from "./member.repository";
import { MemberService } from "./member.service";

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  imports: [DatabaseModule]
})
export class MemberModule {}
