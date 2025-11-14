import { Body, Controller, Post } from '@nestjs/common';

import { MessageService } from './message.service';

import { MessageEntity } from './message.entity';
import { BaseController } from '@/shared/controller';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message')
export class MessageController extends BaseController<MessageEntity>() {
  constructor(public service: MessageService) {
    super(service);
  }

  @Post("new")
  async newMessage(@Body() body: MessageEntity) {
    return this.service.sendMessage(body.content);
  }
}
