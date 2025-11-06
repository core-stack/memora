import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { InviteController } from './invite.controller';
import { InviteRepository } from './invite.repository';
import { InviteService } from './invite.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService, InviteRepository],
  imports: [DatabaseModule]
})
export class InviteModule {}
