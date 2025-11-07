import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import {
  CreateInviteSchema, createInviteSchema, inviteFilterSchema, InviteSchema
} from '@snipet/schemas';

import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController extends CrudController<InviteSchema, CreateInviteSchema>(
  { filterSchema: inviteFilterSchema, createDtoSchema: createInviteSchema }
) {
  constructor(service: InviteService) {
    super(service);
  }
}
