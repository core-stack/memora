import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateKnowledgeFolder, KnowledgeFolder, UpdateKnowledgeFolder } from '@snipet/schemas';

import { KnowledgeService } from '../knowledge.service';
import { CreateFolderEntity, FolderEntity, UpdateFolderEntity } from './folder.entity';
import { FolderRepository } from './folder.repository';

@Injectable()
export class FolderService extends GenericTenantService<
  KnowledgeFolder, CreateKnowledgeFolder, UpdateKnowledgeFolder,
  FolderEntity, CreateFolderEntity, UpdateFolderEntity
> {
  logger = new Logger(FolderService.name);
  constructor(
    protected readonly repository: FolderRepository,
    private readonly knowledgeService: KnowledgeService
  ) {
    super(repository);
  }

  override async find(filterOpts: FilterOptions<KnowledgeFolder>, opts?: ServiceOptions): Promise<KnowledgeFolder[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(opts?.http));
    filterOpts.filter = filterOpts.filter ?? {};
    filterOpts.filter.knowledgeId = knowledgeId;
    return super.find(filterOpts, opts);
  }

  override async create(input: CreateKnowledgeFolder, opts?: ServiceOptions): Promise<KnowledgeFolder> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(opts?.http));
    const parentId = opts?.http?.query.getString("parentId");

    if (parentId) input.parentId = parentId;

    return super.create({
      ...input,
      knowledgeId
    }, opts);
  }

  async getPathByFolderId(fileName: string, folderId?: string, opts?: ServiceOptions) {
    if (!folderId) return "";
    const folder = await this.repository.findByID(folderId, { tx: opts?.tx });
    if (!folder) throw new Error("Folder not found");
    const path = [folder.name];
    if (folder.parentId) {
      let parent = await this.repository.findByID(folder.parentId, { tx: opts?.tx });
      while (parent) {
        path.unshift(parent.name);
        if (!parent.parentId) break;
        parent = await this.repository.findByID(parent.parentId, { tx: opts?.tx });
      }
    }
    return path.join("/") + "/" + fileName;
  }
}
