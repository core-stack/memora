import { knowledgePlugin } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { KnowledgePlugin } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgePluginRepository extends DrizzleGenericRepository<typeof knowledgePlugin, KnowledgePlugin> {
  constructor() {
    super(knowledgePlugin);
  }
}
