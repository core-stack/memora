import { FolderEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class CreateFolderDto extends PickType(FolderEntity, ['parentId', 'name']) {
 }