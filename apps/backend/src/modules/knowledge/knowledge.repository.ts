import { and, eq, inArray } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

import { knowledge, knowledgeLLM } from '@/db/schema';
import { knowledgeTag } from '@/db/schema/knowledge_tag';
import { DrizzleGenericRepository } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { increment } from '@/infra/database/utils';
import { Injectable } from '@nestjs/common';
import { KnowledgeTag } from '@snipet/schemas';

import { CreateKnowledgeEntity, KnowledgeEntity, UpdateKnowledgeEntity } from './knowledge.entity';

@Injectable()
export class KnowledgeRepository extends DrizzleGenericRepository<
  typeof knowledge, KnowledgeEntity, CreateKnowledgeEntity, UpdateKnowledgeEntity
> {
  constructor() {
    super(knowledge);
  }

  async findBySlug(slug: string, repoOpts?: RepositoryOptions<TxType>): Promise<KnowledgeEntity | null> {
    const res = await this.find({ filter: { slug } }, repoOpts);
    return res[0] || null;
  }

  override async find(opts: FilterOptions<KnowledgeEntity>, repoOpts?: RepositoryOptions<TxType>): Promise<KnowledgeEntity[]> {
    return this.run(async (db) => {
      if (!opts.limit) opts.limit = 1000;
      if (!opts.offset) opts.offset = 0;
      const { filter, order } = this.buildFilter(opts);
      const query = db.select().from(this.table as PgTable)
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
      let result = [] as KnowledgeEntity[];

      if (opts.include && opts.include?.length > 0) {
        result = rows.reduce((acc, row) => {
          const kn = row.knowledge as KnowledgeEntity;
          const tag = row.knowledge_tag as KnowledgeTag;

          const index = acc.findIndex(p => p.id === kn.id);
          if (index === -1) {
            if (tag) acc.push({...kn, tags: [tag] as KnowledgeTag[]});
            else acc.push({...kn, tags: [] });
          } else {
            if (tag) acc[index].tags.push(tag);
          }
          return acc;
        }, [] as KnowledgeEntity[]);
      } else {
        result = rows as KnowledgeEntity[];
      }

      return result;
    }, repoOpts);
  }

  override async create(data: CreateKnowledgeEntity, repoOpts?: RepositoryOptions<TxType>): Promise<KnowledgeEntity> {
    return this.run(async (db) => {
      const [createdKnowledge] = await db.insert(knowledge).values({
        slug: data.slug,
        title: data.title,
        tenantId: data.tenantId,
        description: data.description,
        instructions: data.instructions,
      }).returning();
      await db.insert(knowledgeLLM).values({
        knowledgeId: createdKnowledge.id,
        llmId: data.embeddingModelId
      });
      if (data.tags && data.tags.length > 0) {
        await db.insert(knowledgeTag).values(data.tags.map(tag => ({
          knowledgeId: createdKnowledge.id,
          name: tag,
          tenantId: data.tenantId
        } as KnowledgeTag)));
      }
      return createdKnowledge as KnowledgeEntity;
    }, repoOpts, true);
  }

  override async update(id: string, data: UpdateKnowledgeEntity, repoOpts?: RepositoryOptions<TxType>): Promise<void> {
    return this.run(async (db) => {
      await db.update(knowledge).set(data as unknown as KnowledgeEntity).where(eq(knowledge.id, id));
      if (!data.tenantId) {
        const kn = await db.select().from(knowledge).where(eq(knowledge.id, id));
        data.tenantId = kn[0]?.tenantId;
      }
      const createdTags = await db.select().from(knowledgeTag).where(eq(knowledgeTag.knowledgeId, id));
      const tagsToDelete = createdTags.filter(tag => !data.tags?.includes(tag.name)).map(t => t.id);
      const tagsToCreate = data.tags?.filter(tag => !createdTags.some(t => t.name === tag)) || [];

      if (tagsToDelete.length > 0) {
        await db.delete(knowledgeTag).where(inArray(knowledgeTag.id, tagsToDelete));
      }

      if (tagsToCreate.length > 0) {
        await db.insert(knowledgeTag).values(tagsToCreate.map(tag => ({
          knowledgeId: id,
          name: tag,
          tenantId: data.tenantId
        } as KnowledgeTag)));
      }
    }, repoOpts, true);
  }

  async increment(id: string, field: keyof KnowledgeEntity, count: number = 1, repoOpts?: RepositoryOptions<TxType>): Promise<void> {
    return await this.run(async (db) => {
      await db.update(knowledge)
        .set({ [field]: increment(knowledge[field], count) })
        .where(eq(knowledge.id, id))
    }, repoOpts);
  }
}