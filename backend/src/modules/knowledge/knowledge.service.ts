import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}
}
