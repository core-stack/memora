import { CrudController } from "@/generics";
import {
  Chat, chatFilterSchema,
  createChatSchema,
  createChatWithInitialMessage, updateChatSchema
} from "@memora/schemas";
import type { CreateChatWithInitialMessage } from "@memora/schemas";
import { Controller, Post, Req } from "@nestjs/common";

import { ChatService } from "./chat.service";
import { ZodBody } from "@/shared/decorators/zod-body";
import type { Request } from "express";

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

  @Post("with-message")
  async createWithMessage(
    @Req() req: Request,
    @ZodBody(createChatWithInitialMessage) body: CreateChatWithInitialMessage
  ) {
    return this.service.createWithMessage(body, this.loadContext(req));
  }
}
