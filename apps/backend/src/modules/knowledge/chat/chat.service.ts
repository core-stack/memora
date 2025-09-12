import { TenantService } from '@/generics/tenant.service';
import { Chat } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService extends TenantService<Chat> {
  constructor(protected readonly repository: ChatRepository) {
    super(repository);
  }

}
