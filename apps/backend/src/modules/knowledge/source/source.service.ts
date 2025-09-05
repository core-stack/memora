import { TenantService } from "@/services/tenant.service";
import { Source } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { SourceRepository } from "./source.repository";

@Injectable()
export class SourceService extends TenantService<Source> {
  constructor(repository: SourceRepository) {
    super(repository);
  }
}
