import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService],
  imports: [DatabaseModule],
  exports: [MemberService]
})
export class MemberModule {}
