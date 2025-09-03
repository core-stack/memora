import { RepositoryModule } from "@/services/repository/repository.module";
import { Module } from "@nestjs/common";

import { FolderController } from "./folder.controller";
import { FolderRepository } from "./folder.repository";
import { FolderService } from "./folder.service";

@Module({
  controllers: [FolderController],
  providers: [FolderService, FolderRepository],
  imports: [RepositoryModule]
})
export class FolderModule {}
