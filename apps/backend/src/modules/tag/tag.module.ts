import { RepositoryModule } from "@/infra/repository/repository.module";
import { Module } from "@nestjs/common";

import { TagController } from "./tag.controller";
import { TagRepository } from "./tag.repository";
import { TagService } from "./tag.service";

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
  imports: [RepositoryModule]
})
export class TagModule {}
