import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/decorators/controller';

import { ChatEntity } from '../../../entities/chat.entity';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/chat')
export class ChatController extends BaseController({ entity: ChatEntity, createDto: CreateChatDto, updateDto: UpdateChatDto }) {
  constructor(public service: ChatService) {
    super(service);
  }
}
