import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { ChatEntity } from '../../../entities/chat.entity';
import { ChatService } from './chat.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/chat')
export class ChatController extends BaseController(ChatEntity) {
  constructor(public service: ChatService) {
    super(service);
  }
}
