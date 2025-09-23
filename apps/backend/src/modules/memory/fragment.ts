import crypto from 'crypto';

import { Chunks } from '@/generics/chunk';
import { mergeBy } from '@/utils/array';

export enum OriginType {
  PLUGIN,
  FILES
}

export class Fragment {
  id: string;

  get content() { return this._content; }
  get cached() { return this._cached; }
  get metadata() { return this._metadata; }
  get originType() { return this._originType; }
  get originId() { return this._originId; }

  constructor(
    private _originType: OriginType,
    private _originId: string,
    private _content: string,
    private _cached: boolean,
    private _metadata?: Record<string, any>,
  ) {
    this.id = this.generateId();
  }

  private generateId(): string {
    const data = JSON.stringify({
      originType: this._originType,
      originId: this._originId,
      content: this._content,
      cached: this._cached,
    })

    return crypto.createHash("sha256").update(data).digest("hex")
  }
}


export class Fragments {
  static fromFragmentArray(fragments: Fragment[]): Fragments {
    return new Fragments(fragments);
  }

  constructor(private fragments: Fragment[] = []) {}

  push(...fragments: Fragment[]) {
    if (!fragments.length) return;
    this.fragments = mergeBy("id", this.fragments, fragments);
  }

  merge(fragments: Fragments) {
    this.push(...fragments.fragments);
  }

  fromChunks(chunks: Chunks) {
    this.push(
      ...chunks.map(chunk => new Fragment(
        OriginType.FILES,
        chunk.id,
        chunk.content,
        false,
        { seqId: chunk.seqId, knowledgeId: chunk.knowledgeId, sourceId: chunk.sourceId, tenantId: chunk.tenantId }
      ))
    );
  }
}