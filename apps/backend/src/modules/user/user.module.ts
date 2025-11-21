import { DatabaseModule } from "@/infra/database/database.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [ UserController ],
  providers: [ UserService ],
  imports: [ DatabaseModule, HTTPContextModule ],
  exports: [ UserService ]
})
export class UserModule {}
