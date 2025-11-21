import { ChatEntity } from "@/entities";
import { PickType } from "@nestjs/swagger";

export class CreateChatDto extends PickType(ChatEntity, [ "name" ]) {}
