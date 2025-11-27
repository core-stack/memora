import { EntityManager, IsNull } from "typeorm";

import { FilterOptions } from "@/shared/filter-options";
import { Service } from "@/shared/service";
import { Injectable, Logger } from "@nestjs/common";

import { FolderEntity } from "../../../entities/folder.entity";

@Injectable()
export class FolderService extends Service<FolderEntity> {
  entity = FolderEntity;
  logger = new Logger(FolderService.name);

  async getPathByFolderId(
    fileName: string,
    folderId?: string,
    manager?: EntityManager
  ): Promise<string> {
    if (!folderId) return "";
    const folder = await this.repository(manager).findOneBy({ id: folderId });
    if (!folder) throw new Error("Folder not found");
    const path = [ folder.name ];

    if (folder.parentId) {
      let parent = await this.repository(manager).findOneBy({ id: folder.parentId });
      while (parent) {
        path.unshift(parent.name);
        if (!parent.parentId) break;
        parent = await this.repository(manager).findOneBy({ id: folder.parentId });
      }
    }
    return path.join("/") + "/" + fileName;
  }

  override find(
    filterOptions: FilterOptions<FolderEntity>,
    manager?: EntityManager
  ): Promise<FolderEntity[]> {
    filterOptions.where ??= {};
    if (filterOptions.where.parentId === undefined) filterOptions.where.parentId = IsNull();
    return super.find(filterOptions, manager);
  }
}
