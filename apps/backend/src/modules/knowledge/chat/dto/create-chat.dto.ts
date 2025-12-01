import { ChatEntity } from "@/entities";
import { KnowledgeId, TenantId } from "@/shared/controller/decorators";
import { PickType } from "@nestjs/swagger";

export class CreateChatDto extends PickType(ChatEntity, [ "name" ]) {

  @TenantId()
  tenantId: string;

  @KnowledgeId()
  knowledgeId: string;
}
