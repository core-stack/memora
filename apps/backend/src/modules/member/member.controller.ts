
import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/decorators/controller';

import { MemberEntity } from '../../entities/member.entity';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

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
