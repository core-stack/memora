import { MessageEntity } from '@/entities/message.entity';
import { BaseController } from '@/shared/controller';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CreateMessageDto, CreateMessageResponseDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message')
export class MessageController extends BaseController({ entity: MessageEntity }) {
  constructor(public service: MessageService) {
    super(service);
  }

  @Post("new")
  @ApiResponse({ type: CreateMessageResponseDto, status: 200 })
  async newMessage(@Body() body: CreateMessageDto) {
    return this.service.sendMessage(body.content);
  }
}
