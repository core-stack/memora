import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { InviteController } from './invite.controller';
import { InviteRepository } from './invite.repository';
import { InviteService } from './invite.service';
import { RoleModule } from '../role/role.module';
import { MemberModule } from '../member/member.module';
import { TenantModule } from '../tenant/tenant.module';
import { EmailModule } from '@/jobs/email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [InviteController],
  providers: [InviteService, InviteRepository],
  imports: [DatabaseModule, RoleModule, MemberModule, TenantModule, EmailModule, UserModule]
})
export class InviteModule {}
