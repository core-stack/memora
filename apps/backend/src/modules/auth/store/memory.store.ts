import { Injectable } from "@nestjs/common";
import { Store, StoreOptions } from "./types";

@Injectable()
export class MemoryStore<T> implements Store<T> {
  private store: Record<string, { data: T; expiresAt?: number }> = {};

  get(key: string): T | null {
    const item = this.store[key];
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      delete this.store[key];
      return null;
    }
    return item.data;
  }

  set(key: string, value: T, opts?: StoreOptions): void {
    this.store[key] = { data: value, expiresAt: opts?.expiry ? Date.now() + opts.expiry : undefined };
  }

  delete(key: string): void {
    delete this.store[key];
  }

  async getMany(cursor: number = 0, limit: number = 10): Promise<{ cursor: number, items: T[]}> {
    this.cleanExpired();

    const keys = Object.keys(this.store);
    const result: T[] = [];

    let currentIndex = cursor;
    let itemsAdded = 0;

    while (currentIndex < keys.length && itemsAdded < limit) {
      const key = keys[currentIndex];
      const item = this.store[key];

      if (item) {
        result.push(item.data);
        itemsAdded++;
      }

      currentIndex++;
    }

    const nextCursor = currentIndex >= keys.length ? -1 : currentIndex;

    return { cursor: nextCursor, items: result };
  }

  async getAll(): Promise<T[]> {
    this.cleanExpired();
    return Object.values(this.store).map(item => item.data);
  }

  private cleanExpired(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      const item = this.store[key];
      if (item.expiresAt && item.expiresAt <= now) {
        delete this.store[key];
      }
    });
  }
}