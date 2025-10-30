import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [DatabaseModule],
  exports: [UserService, UserRepository],
})
export class UserModule {}
