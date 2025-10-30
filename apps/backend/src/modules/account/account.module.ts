import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  imports: [DatabaseModule],
  exports: [AccountService]
})
export class AccountModule {}
