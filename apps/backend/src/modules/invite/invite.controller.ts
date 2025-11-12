import { CrudController } from '@/generics';
import { Controller, Post, Req } from '@nestjs/common';
import {
 createInviteSchema, inviteFilterSchema, InviteSchema
} from '@snipet/schemas';
import type { CreateInviteSchema } from "@snipet/schemas";
import { InviteService } from './invite.service';
import { ZodBody } from '@/shared/decorators/zod-body';
import type { Request } from 'express';

@Controller('tenant/:tenantId/invite')
export class InviteController extends CrudController<InviteSchema, CreateInviteSchema>(
  { filterSchema: inviteFilterSchema, createDtoSchema: createInviteSchema }
) {
  constructor(public service: InviteService) {
    super(service);
  }

  @Post("send")
  async send(@Req() req: Request, @ZodBody(createInviteSchema) invites: CreateInviteSchema) {
    return this.service.send(invites, { http: this.loadContext(req) });
  }
}
