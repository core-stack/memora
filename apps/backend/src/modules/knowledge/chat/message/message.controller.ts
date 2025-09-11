import { CrudController } from "@/generics";
import { createMessageSchema, Message, messageFilterSchema, updateMessageSchema } from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { MessageService } from "./message.service";

@Controller('knowledge/:knowledgeSlug/chat/:chatId/message')
export class MessageController extends CrudController<Message> {
  constructor(protected readonly service: MessageService) {
    super(
      service,
      messageFilterSchema,
      createMessageSchema,
      updateMessageSchema
    );
  }
}
