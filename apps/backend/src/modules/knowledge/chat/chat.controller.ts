import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { Chat, chatFilterSchema, createChatSchema, updateChatSchema } from '@snipet/schemas';

import { ChatService } from './chat.service';

@Controller('knowledge/:knowledgeSlug/chat')
export class ChatController extends CrudController<Chat> {
  constructor(protected readonly service: ChatService) {
    super(
      service,
      chatFilterSchema,
      createChatSchema,
      updateChatSchema
    );
  }
}
