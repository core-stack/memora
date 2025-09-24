import { Chunks } from "@/generics/chunk";
import { mergeBy } from "@/utils/array";
import { Fragment, OriginType } from "@memora/schemas";

export class Fragments {
  static fromFragmentArray(fragments: Fragment[]): Fragments {
    return new Fragments(fragments);
  }

  constructor(private fragments: Fragment[] = []) {}

  push(...fragments: Fragment[]): this {
    if (!fragments.length) return this;
    this.fragments = mergeBy("id", this.fragments, fragments);
    return this;
  }

  merge(fragments: Fragments): this {
    this.push(...fragments.fragments);
    return this;
  }

  static fromChunks(chunks: Chunks): Fragments {
    const fragments = new Fragments();
    fragments.push(
      ...chunks.map(chunk => ({
        id: chunk.id,
        content: chunk.content,
        originType: OriginType.FILES,
        originId: chunk.sourceId,
        tenantId: chunk.tenantId,
        knowledgeId: chunk.knowledgeId,
        cached: false,
        metadata: {
          seqId: chunk.seqId,
          knowledgeId: chunk.knowledgeId,
          sourceId: chunk.sourceId,
          tenantId: chunk.tenantId
        }
      } as Fragment)
      )
    );
    return fragments;
  }

  toArray(): Fragment[] {
    return this.fragments;
  }
}