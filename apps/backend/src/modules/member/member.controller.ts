
import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { MemberEntity } from '../../entities/member.entity';
import { MemberService } from './member.service';

@Controller('tenant/:tenantId/member')
export class MemberController extends BaseController<MemberEntity>() {
  constructor(service: MemberService) {
    super(service);
  }
}
