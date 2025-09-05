import { TenantService } from "@/services/tenant.service";
import { KnowledgeFolder } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { FolderRepository } from "./folder.repository";

@Injectable()
export class FolderService extends TenantService<KnowledgeFolder> {
  constructor(repository: FolderRepository) {
    super(repository);
  }
}
