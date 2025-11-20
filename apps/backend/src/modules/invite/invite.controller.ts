import { InviteEntity } from '@/entities/invite.entity';
import { BaseController } from '@/shared/controller';
import { Controller, HttpPost } from '@/shared/controller/decorators';
import { Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { SendInviteDto, SendInviteResponseDto } from './dto/send-invites.dto';
import { InviteService } from './invite.service';

@Controller('tenant/:tenantId/invite')
export class InviteController extends BaseController({ entity: InviteEntity }) {
  constructor(public service: InviteService) {
    super(service);
  }

  @HttpPost("send")
  @ApiResponse({ status: 200, type: SendInviteResponseDto, isArray: true })
  async send(@Body() invites: SendInviteDto) {
    return this.service.send(invites);
  }
}
