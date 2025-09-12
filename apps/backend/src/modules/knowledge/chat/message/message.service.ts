import { TenantService } from '@/generics/tenant.service';
import { Message } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService extends TenantService<Message> {
  constructor(protected readonly repository: MessageRepository) {
    super(repository);
  }

}
