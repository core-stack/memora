import { Controller } from '@nestjs/common';

import { ChatService } from './chat.service';
import { BaseController } from '@/shared/controller';
import { ChatEntity } from './chat.entity';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/chat')
export class ChatController extends BaseController<ChatEntity>() {
  constructor(public service: ChatService) {
    super(service);
  }
}
