import { FolderEntity } from "@/entities";
import { KnowledgeId, TenantId } from "@/shared/controller/decorators";
import { PickType } from "@nestjs/swagger";

export class CreateFolderDto extends PickType(FolderEntity, [ "parentId", "name" ]) {
  @KnowledgeId()
  knowledgeId: string;

  @TenantId()
  tenantId: string;
}
