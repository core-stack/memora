import { DatabaseModule } from '@/infra/database/database.module';
import { HTTPContextModule } from '@/shared/http-context/http-context.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantEntity } from '../../entities/tenant.entity';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { RoleModule } from '../role/role.module';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
  imports: [
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forFeature([TenantEntity]),
    HTTPContextModule,
    MemberModule,
    RoleModule
  ],
  exports: [TenantService],
})
export class TenantModule {}
