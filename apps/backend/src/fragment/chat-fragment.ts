import { chatFragmentSchema } from '@memora/schemas';

import { BaseFragment } from './fragment';

export class ChatFragment extends BaseFragment {
  role: string;
  chatId: string;
  knowledgeId: string;
  tenantId: string;

  constructor(
    f: Omit<ChatFragment, "id" | "createdAt" | "updatedAt"> & { id?: string, createdAt?: Date, updatedAt?: Date }
  ) {
    super(f);
    this.knowledgeId = f.knowledgeId;
    this.chatId = f.chatId;
    this.role = f.role;
    this.tenantId = f.tenantId;
    this.metadata = f.metadata;
    chatFragmentSchema.parse(this);
  }

  static fromObject(obj: ChatFragment): ChatFragment {
    return new ChatFragment(chatFragmentSchema.parse(obj));
  }
}