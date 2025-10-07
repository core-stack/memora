import { and, eq } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

import { knowledge } from '@/db/schema';
import { knowledgeTag } from '@/db/schema/knowledge_tag';
import { DrizzleGenericRepository } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { KnowledgeTag } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { CreateKnowledge, Knowledge, UpdateKnowledge } from './knowledge.schema';

@Injectable()
export class KnowledgeRepository extends DrizzleGenericRepository<typeof knowledge, Knowledge, CreateKnowledge, UpdateKnowledge> {
  constructor() {
    super(knowledge);
  }

  async findBySlug(slug: string): Promise<Knowledge | null> {
    const res = await this.find({ filter: { slug } });
    return res[0] || null;
  }

  override async find(opts: FilterOptions<Knowledge>): Promise<Knowledge[]> {
    if (!opts.limit) opts.limit = 1000;
    if (!opts.offset) opts.offset = 0;
  
    const { filter, order } = this.buildFilter(opts);
    const query = this.db.select().from(this.table as PgTable)
      .where(and(...filter))
      .limit(opts.limit)
      .offset(opts.offset)
      .orderBy(...order);

    if (opts.include) {
      if (opts.include.includes("tags")) {
        query.leftJoin(knowledgeTag, eq(knowledge.id, knowledgeTag.knowledgeId));
      }
    }
    const rows = await query;
    const result = rows.reduce((acc, row) => {
      const knowledge = row.knowledge as Knowledge;
      const tag = row.knowledge_tag as KnowledgeTag;
      const index = acc.findIndex(p => p.id === knowledge.id);
      if (index === -1) {
        if (tag) acc.push({...knowledge, tags: [tag] as KnowledgeTag[]});
        else acc.push({...knowledge, tags: [] });
      } else {
        if (tag) acc[index].tags.push(tag);
      }
      
      return [];
    }, [] as Knowledge[]);
    return result;
  }

  override async create(data: CreateKnowledge): Promise<Knowledge> {
    return await this.db.transaction(async (tx) => {
      const [createdKnowledge] = await tx.insert(knowledge).values({
        slug: data.slug,
        title: data.title,
        tenantId: data.tenantId,
        description: data.description,
        instructions: data.instructions,
      } as Knowledge).returning();
      if (data.tags) {
        await tx.insert(knowledgeTag).values(data.tags.map(tag => ({
          knowledgeId: createdKnowledge.id,
          name: tag,
          tenantId: data.tenantId
        } as KnowledgeTag)));
      }
      return createdKnowledge as Knowledge;
    })
  }
}