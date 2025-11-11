import Redis from "ioredis";

import { Store, StoreOptions } from "./types";
import { Injectable } from "@nestjs/common";

export type RedisStoreOptions = {
  url: string;
  prefix?: string;
}

@Injectable()
export class RedisStore<T> extends Store<T> {
  private redis: Redis;
  private readonly prefix: string;

  constructor({ url, prefix = "auth"}: RedisStoreOptions) {
    super();

    this.redis = new Redis(url);
    this.prefix = prefix;
  }

  private makeKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    const data = await this.redis.get(this.makeKey(key));
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set(key: string, value: T, opts?: StoreOptions): Promise<void> {
    if (opts?.expiry) {
      await this.redis.set(this.makeKey(key), JSON.stringify(value), "EX", opts.expiry / 1000);
    } else {
      const ttl = await this.redis.ttl(this.makeKey(key));
      if (ttl > 0) {
        await this.redis.set(this.makeKey(key), JSON.stringify(value), "KEEPTTL");
      } else {
        await this.redis.set(this.makeKey(key), JSON.stringify(value)); // sem TTL
      }
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.makeKey(key));
  }

  async getMany(
    cursor: number = 0,
    limit: number = 10
  ): Promise<{ cursor: number, items: T[]}> {
    const matchPattern = this.makeKey('*');

    const [nextCursor, keys] = await this.redis.scan(
      cursor,
      'MATCH', matchPattern,
      'COUNT', limit
    );

    if (keys.length === 0) {
      return { cursor: 0, items: [] };
    }

    const values = await this.redis.mget(...keys);

    const items: [string, T][] = keys.map((key, index) => {
      const shortKey = key.substring(this.prefix.length + 1);
      const value = values[index] ? JSON.parse(values[index] as string) as T : null;
      return [shortKey, value];
    }).filter(([, value]) => value !== null) as [string, T][];
    const res = {
      cursor: parseInt(nextCursor, 10),
      items: items.map((i) => i[1]),
    }
    return res;
  }

  async getAll(): Promise<T[]> {
    let cursor = 0;
    const allItems: T[] = [];

    do {
      const { cursor: nextCursor, items } = await this.getMany(cursor, 100);
      allItems.push(...items);
      cursor = nextCursor;
    } while (cursor !== 0);

    return allItems;
  }

}