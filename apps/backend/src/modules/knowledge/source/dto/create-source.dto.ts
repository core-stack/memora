import { SourceEntity } from "@/entities";
import { PickType } from "@nestjs/swagger";

export class CreateSourceDto extends PickType(SourceEntity, [ "name", "originalName", "folderId", "key", "metadata", "sourceType" ]) {
  knowledgeId: string;
}
