import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { Chat, chatFilterSchema, createChatSchema, updateChatSchema } from '@snipet/schemas';

import { ChatService } from './chat.service';

@Controller('knowledge/:knowledgeSlug/chat')
export class ChatController extends CrudController<Chat>(
  { filterSchema: chatFilterSchema, createDtoSchema: createChatSchema, updateDtoSchema: updateChatSchema }
) {
  constructor(public service: ChatService) {
    super(service);
  }
}
