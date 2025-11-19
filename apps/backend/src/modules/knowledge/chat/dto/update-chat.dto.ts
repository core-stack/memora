import { ChatEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class UpdateChatDto extends PickType(ChatEntity, [ 'name' ]) {}