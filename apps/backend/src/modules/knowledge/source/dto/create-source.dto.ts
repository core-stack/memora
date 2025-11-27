import { SourceEntity } from "@/entities";
import { KnowledgeId, TenantId } from "@/shared/controller/decorators";
import { PickType } from "@nestjs/swagger";

export class CreateSourceDto extends PickType(
  SourceEntity,
  [ "name", "originalName", "folderId", "key", "metadata", "sourceType" ]
) {
  @KnowledgeId()
  knowledgeId: string;

  @TenantId()
  tenantId: string;
}
