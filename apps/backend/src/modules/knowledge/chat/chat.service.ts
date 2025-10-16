import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { Chat } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService extends TenantService<Chat> {
  constructor(
    protected readonly repository: ChatRepository,
    private readonly knowledgeService: KnowledgeService
  ) {
    super(repository);
  }

  override async create(input: Partial<Chat>, ctx: HttpContext): Promise<Chat> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    
    input.knowledgeId = knowledgeId;
    input.name = "New Chat";

    return super.create(input, ctx);
  }

  async findWithCountMessages(chatId: string, ctx: HttpContext) {
    return this.repository.findWithCountMessages(chatId);
  }
}
