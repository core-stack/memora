import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

import { PrismaModule } from "src/services/prisma/prisma.module";

import { FolderModule } from "./folder/folder.module";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import { SourceModule } from "./source/source.module";

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  imports: [
    PrismaModule,
    FolderModule,
    SourceModule,
    RouterModule.register([
      {
        path: ":knowledge_slug",
        children: [
          { path: "", module: FolderModule },
          { path: "", module: SourceModule }
        ]
      }
    ])
  ]
})
export class KnowledgeModule {}
