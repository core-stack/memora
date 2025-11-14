
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateKnowledgeFolder, KnowledgeFolder, UpdateKnowledgeFolder } from '@snipet/schemas';

import { KnowledgeService } from '../knowledge.service';
import { FolderEntity } from './folder.entity';
import { Service } from '@/shared/service';
import { FilterOptions } from '@/shared/filter-options';
import { EntityManager } from 'typeorm';

@Injectable()
export class FolderService extends Service<FolderEntity> {
  entity = FolderEntity;
  logger = new Logger(FolderService.name);

  @Inject() private readonly knowledgeService: KnowledgeService

  override async find(filterOpts: FilterOptions<FolderEntity>, manager?: EntityManager): Promise<FolderEntity[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    filterOpts.where = filterOpts.where ?? {};
    filterOpts.where.knowledgeId = knowledgeId;
    return super.find(filterOpts, manager);
  }

  override async create(input: FolderEntity, manager?: EntityManager): Promise<FolderEntity> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    const parentId = this.context.query.getString("parentId");

    if (parentId) input.parentId = parentId;

    return super.create({ ...input, knowledgeId }, manager);
  }

  async getPathByFolderId(fileName: string, folderId?: string, manager?: EntityManager) {
    if (!folderId) return "";
    const folder = await this.repository(manager).findOneBy({ id: folderId });
    if (!folder) throw new Error("Folder not found");
    const path = [folder.name];

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
}
