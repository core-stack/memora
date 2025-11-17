import { DatabaseModule } from '@/infra/database/database.module';
import { HTTPContextModule } from '@/shared/http-context/http-context.module';
import { Module } from '@nestjs/common';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [DatabaseModule, HTTPContextModule, UserModule, RoleModule],
  exports: [AccountService]
})
export class AccountModule {}
