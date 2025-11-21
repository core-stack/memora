import { mergeBy } from "@/utils/array";

import { BaseFragment } from "./fragment";

export class Fragments<T extends BaseFragment> {
  get length(): number { return this.fragments.length; }
  get items(): readonly T[] { return this.fragments; }

  metadata: Record<string, string> = {};

  static fromFragmentArray<T extends BaseFragment>(fragments: T[]): Fragments<T> {
    return new Fragments<T>(fragments);
  }

  constructor(private fragments: T[] = []) {}

  push(...fragments: T[]): this {
    if (!fragments.length) return this;
    this.fragments = mergeBy("id", this.fragments, fragments as T[]);
    return this;
  }

  import(fragments: Fragments<T>) {
    this.fragments = this.fragments.concat(fragments.fragments);
  }

  merge(fragments: Fragments<T>): this {
    this.push(...fragments.fragments);
    return this;
  }

  toArray(): T[] {
    return this.fragments;
  }

  map<U>(fn: (chunk: T) => U): U[] {
    return this.fragments.map(fn);
  }
}
