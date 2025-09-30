import { mergeBy } from '@/utils/array';
import { Fragment as FragmentType } from '@memora/schemas';

import { Fragment } from './fragment';

const isFragment = (f: any): f is Fragment => f instanceof Fragment;

export class Fragments {
  static fromFragmentArray(fragments: Fragment[]): Fragments {
    return new Fragments(fragments);
  }

  constructor(private fragments: Fragment[] = []) {}

  push(...fragments: FragmentType[] | Fragment[]): this {
    if (!fragments.length) return this;
    if (isFragment(fragments[0])) {
      this.fragments = mergeBy("id", this.fragments, fragments as Fragment[]);
    } else {
      this.fragments = fragments.map((f: FragmentType) => new Fragment(f));
    }
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
      chunk.setEmbeddings(embeddings[idx]);
    });
  }
}