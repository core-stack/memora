import { Injectable } from '@nestjs/common';
import { Chat, CreateChat, UpdateChat } from '@snipet/schemas';

import { KnowledgeService } from '../knowledge.service';
import { ChatRepository } from './chat.repository';
import { CrudService } from '@/generics';
import { ServiceOptions } from '@/generics/service.interface';
import { ChatEntity, CreateChatEntity, UpdateChatEntity } from './chat.entity';

@Injectable()
export class ChatService extends CrudService<
  Chat, CreateChat, UpdateChat,
  ChatEntity, CreateChatEntity, UpdateChatEntity
> {
  constructor(
    protected readonly repository: ChatRepository,
    private readonly knowledgeService: KnowledgeService
  ) {
    super(repository);
  }

  override async create(input: CreateChat, opts?: ServiceOptions): Promise<Chat> {
    if (!opts?.http) throw new Error("http context is required");
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(opts.http);

    if (!input.name) input.name = "New Chat";

    return super.create({ ...input, knowledgeId }, opts);
  }

  async findWithCountMessages(chatId: string, opts?: ServiceOptions) {
    return this.repository.findWithCountMessages(chatId, { tx: opts?.tx });
  }
}
