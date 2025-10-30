import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { MemberSchema, tagFilterSchema } from '@snipet/schemas';

import { MemberService } from './member.service';

@Controller('member')
export class MemberController extends CrudController<MemberSchema>(tagFilterSchema) {
  constructor(service: MemberService) {
    super(service);
  }
}
