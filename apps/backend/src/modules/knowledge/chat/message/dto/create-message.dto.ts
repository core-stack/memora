import { MessageEntity } from '@/entities';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateMessageDto extends PickType(MessageEntity, ['content']) {}


export class CreateMessageResponseDto {
  @ApiProperty()
  userMessage: MessageEntity;
  
  @ApiProperty()
  aiMessage: MessageEntity;

  constructor(userMessage: MessageEntity, aiMessage: MessageEntity) {
    this.userMessage = userMessage;
    this.aiMessage = aiMessage;
  }
}