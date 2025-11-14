import { Body, Controller, Post } from '@nestjs/common';
import { InviteService } from './invite.service';
import { BaseController, HttpPost } from '@/shared/controller';
import { InviteEntity } from './invite.entity';
import { SendInviteDto } from './dto/send-invites.dto';

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
