import { CreateKnowledgeBase, UpdateKnowledgeBase } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { env } from "src/env";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.knowledgeBase.findMany({ where: { tenantId: env.TENANT_ID } });
  }

  async create(kb: CreateKnowledgeBase) {
    return this.prisma.knowledgeBase.create({ data: { ...kb, tenantId: env.TENANT_ID } });
  }

  async update({id, ...kb}: UpdateKnowledgeBase) {
    return this.prisma.knowledgeBase.update({ where: { id }, data: kb });
  }

  async delete(id: string) {
    return this.prisma.knowledgeBase.delete({ where: { id } });
  }
}
