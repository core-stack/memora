import { MessageEntity } from "@/entities";
import { KnowledgeId, TenantId } from "@/shared/controller/decorators";
import { ApiProperty, PickType } from "@nestjs/swagger";

export class SendMessageDto extends PickType(MessageEntity, [ "content" ]) {
  @TenantId()
  tenantId: string;

  @KnowledgeId()
  knowledgeId: string;

}


export class SendMessageResponseDto {
  @ApiProperty()
  userMessage: MessageEntity;

  @ApiProperty()
  aiMessage: MessageEntity;

  constructor(userMessage: MessageEntity, aiMessage: MessageEntity) {
    this.userMessage = userMessage;
    this.aiMessage = aiMessage;
  }
}
