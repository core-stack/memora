import type { Request, Response } from 'express';

import { CrudController } from '@/generics';
import { ZodBody } from '@/shared/decorators/zod-body';
import { Controller, Post, Req } from '@nestjs/common';
import {
  createMessageSchema, Message, messageFilterSchema, updateMessageSchema
} from '@snipet/schemas';

import { MessageService } from './message.service';

import type { CreateMessage, StreamMessage } from "@snipet/schemas";
@Controller('knowledge/:knowledgeSlug/chat/:chatId/message')
export class MessageController
  extends CrudController<Message>(messageFilterSchema, createMessageSchema, updateMessageSchema) {
  constructor(public service: MessageService) {
    super(service);
  }

  @Post("new")
  async newMessage(
    @Req() req: Request,
    @ZodBody(createMessageSchema) body: CreateMessage,
  ) {
    return this.service.sendMessage(body.content, this.loadContext(req));
  }
}
