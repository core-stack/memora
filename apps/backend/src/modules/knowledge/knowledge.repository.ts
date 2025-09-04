import { knowledge } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { Knowledge } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeRepository extends DrizzleGenericRepository<typeof knowledge, Knowledge> {
  constructor() {
    super(knowledge);
  }

  async findBySlug(slug: string) {
    return this.find({ filter: { slug } });
  }
}