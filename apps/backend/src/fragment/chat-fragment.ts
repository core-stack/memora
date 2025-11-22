
import { MessageRole } from '@/entities';
import { Field } from '@/shared/model';

import { BaseFragment } from './fragment';

export class ChatMetadata {}

export class ChatFragment extends BaseFragment {
  @Field({ type: "enum", enum: MessageRole, required: true, description: 'The role of the message sender' })
  role: MessageRole;
  
  @Field({ type: "string", uuid: true, required: true, description: 'The ID of the chat this message belongs to' })
  chatId: string;
  
  @Field({ type: "string", uuid: true, required: true, description: 'The ID of the knowledge base associated with this message' })
  knowledgeId: string;
  
  @Field({ type: "string", uuid: true, required: true, description: 'The ID of the tenant this message belongs to' })
  tenantId: string;

  @Field({ type: "class", class: () => ChatMetadata, required: false })
  metadata: any;

  constructor(
    f: Omit<ChatFragment, "id" | "createdAt" | "updatedAt"> & { id?: string, createdAt?: Date, updatedAt?: Date }
  ) {
    super(f);
    this.knowledgeId = f.knowledgeId;
    this.chatId = f.chatId;
    this.role = f.role;
    this.tenantId = f.tenantId;
  }

  static fromObject(obj: ChatFragment): ChatFragment {
    return new ChatFragment(obj);
  }
}
