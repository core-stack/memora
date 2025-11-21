import { ChatEntity } from "@/entities";
import { ApiHideProperty, PickType } from "@nestjs/swagger";

export class CreateChatDto extends PickType(ChatEntity, [ "name" ]) {
  @ApiHideProperty()
  knowledgeId: string;
}
