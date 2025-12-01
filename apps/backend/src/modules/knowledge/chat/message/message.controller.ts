import { MessageEntity } from "@/entities/message.entity";
import { BaseController } from "@/shared/controller";
import { Controller, HttpPost } from "@/shared/controller/decorators";
import { HttpBody } from "@/shared/controller/decorators/body";
import { ApiResponse } from "@nestjs/swagger";

import { SendMessageDto, SendMessageResponseDto } from "./dto/send-message.dto";
import { MessageService } from "./message.service";

@Controller("tenant/:tenantId/knowledge/:knowledgeId/chat/:chatId/message")
export class MessageController extends BaseController({ entity: MessageEntity }) {
  constructor(public service: MessageService) {
    super(service);
  }

  @HttpPost("new")
  @ApiResponse({ type: SendMessageResponseDto, status: 200 })
  async newMessage(@HttpBody(SendMessageDto) body: SendMessageDto): Promise<SendMessageResponseDto> {
    return this.service.sendMessage(body);
  }
}
