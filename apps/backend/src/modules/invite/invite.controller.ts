import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { createInviteSchema, InviteSchema, tagFilterSchema } from '@snipet/schemas';

import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController extends CrudController<InviteSchema>(
  { filterSchema: tagFilterSchema, createDtoSchema: createInviteSchema }
) {
  constructor(service: InviteService) {
    super(service);
  }
}
