import { CreateKnowledgeBase, UpdateKnowledgeBase } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { env } from "src/env";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  async create(kb: CreateKnowledgeBase) {
    return this.prisma.knowledgeBase.create({
      data: {
        slug: kb.slug,
        title: kb.title,
        description: kb.description,
        tenantId: env.TENANT_ID
      }
    });
  }

  async update(kb: UpdateKnowledgeBase) {
    return this.prisma.knowledgeBase.update({
      where: { id: kb.id },
      data: {
        title: kb.title,
        description: kb.description
      }
    });
  }
}
