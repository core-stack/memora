
import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { MemberEntity } from '../../entities/member.entity';
import { MemberService } from './member.service';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('tenant/:tenantId/member')
export class MemberController extends BaseController({
  entity: MemberEntity,
  updateDto: UpdateMemberDto,
  ignore: [ 'create' ]
}) {
  constructor(service: MemberService) {
    super(service);
  }
}
