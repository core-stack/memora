import { mergeBy } from "@/utils/array";

import { Fragment } from "./fragment";

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

  import(fragments: Fragments) {
    this.fragments = this.fragments.concat(fragments.fragments);
  }

  merge(fragments: Fragments): this {
    this.push(...fragments.fragments);
    return this;
  }

  toArray(): Fragment[] {
    return this.fragments;
  }

  map<T>(fn: (chunk: Fragment) => T) {
    return this.fragments.map<T>(fn);
  }

  setEmbeddings(embeddings: number[][]) {
    this.fragments.forEach((chunk, idx) => {
      chunk.setEmbedding(embeddings[idx]);
    });
  }
}