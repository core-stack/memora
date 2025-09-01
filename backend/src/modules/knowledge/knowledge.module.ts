import { Module } from "@nestjs/common";

import { PrismaModule } from "src/services/prisma/prisma.module";

import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  imports: [PrismaModule]
})
export class KnowledgeModule {}
