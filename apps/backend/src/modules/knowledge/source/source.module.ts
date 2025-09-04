import { RepositoryModule } from "@/infra/repository/repository.module";
import { Module } from "@nestjs/common";

import { SourceController } from "./source.controller";
import { SourceRepository } from "./source.repository";
import { SourceService } from "./source.service";

@Module({
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  imports: [RepositoryModule]
})
export class SourceModule {}
