import { FolderEntity } from "@/entities";
import { ApiHideProperty, PickType } from "@nestjs/swagger";

export class CreateFolderDto extends PickType(FolderEntity, [ "parentId", "name", "knowledgeId" ]) {

  @ApiHideProperty()
  override knowledgeId: string;
}
