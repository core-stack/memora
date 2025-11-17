import { InviteEntity } from '@/entities/invite.entity';
import { BaseController, HttpPost } from '@/shared/controller';
import { Body, Controller } from '@nestjs/common';

import { SendInviteDto } from './dto/send-invites.dto';
import { InviteService } from './invite.service';

@Controller('tenant/:tenantId/invite')
export class InviteController extends BaseController<InviteEntity>() {
  constructor(public service: InviteService) {
    super(service);
  }

  @HttpPost("send")
  async send(@Body() invites: SendInviteDto) {
    return this.service.send(invites);
  }
}
