import { CrudController } from "@/generics";
import { Chat, chatFilterSchema, createChatSchema, updateChatSchema } from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { ChatService } from "./chat.service";

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
