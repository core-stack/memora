import { env } from '@/env';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationTokenEntity } from '@/modules/verification-token/verification-token.entity';
import { TenantEntity } from '@/modules/tenant/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([VerificationTokenEntity, TenantEntity]),
  ],
})
export class DatabaseModule {}
