import { InviteEntity } from "@/entities/invite.entity";
import { BaseController } from "@/shared/controller";
import { ApiResponses, Controller, HttpPost } from "@/shared/controller/decorators";
import { HttpBody } from "@/shared/controller/decorators/body";

import { SendInviteDto, SendInviteResponseDto } from "./dto/send-invites.dto";
import { InviteService } from "./invite.service";

@Controller("tenant/:tenantId/invite")
export class InviteController extends BaseController({ entity: InviteEntity }) {
  constructor(public service: InviteService) {
    super(service);
  }

  @HttpPost("send")
  @ApiResponses([
    { status: 200, type: SendInviteResponseDto, isArray: true, description: "Emails sent" }
  ])
  async send(@HttpBody(SendInviteDto) invites: SendInviteDto): Promise<SendInviteResponseDto> {
    return this.service.send(invites);
  }
}
