import { FolderEntity } from "@/entities";
import { PickType } from "@nestjs/swagger";

export class UpdateFolderDto extends PickType(FolderEntity, [ "name" ]) {
}
