import { CreateKnowledgeFolder, UpdateKnowledgeFolder } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { env } from "src/env";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.knowledgeBaseFolder.findMany({ where: { tenantId: env.TENANT_ID } });
  }

  async create(kb: CreateKnowledgeFolder) {
    return this.prisma.knowledgeBaseFolder.create({
      data: {
        slug: kb.slug,
        name: kb.name,
        description: kb.description,
        tenantId: env.TENANT_ID,
        parent: kb.parentId ? { connect: { id: kb.parentId } } : undefined,
        knowledgeBase: {
          connect: {
            id: kb.knowledgeBaseId
          }
        }
      }
    });
  }

  async update(kb: UpdateKnowledgeFolder) {
    return this.prisma.knowledgeBaseFolder.update({
      where: { id: kb.id },
      data: {
        name: kb.name,
        description: kb.description,
        parent: kb.parentId ? { connect: { id: kb.parentId } } : undefined,
      }
    });
  }

  async delete(id: string) {
    return this.prisma.knowledgeBaseFolder.delete({ where: { id } });
  }
}
