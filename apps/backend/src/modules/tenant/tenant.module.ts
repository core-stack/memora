import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { TenantController } from './tenant.controller';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
  imports: [
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forFeature([TenantEntity]),
  ],
  exports: [TenantService],
})
export class TenantModule {}
