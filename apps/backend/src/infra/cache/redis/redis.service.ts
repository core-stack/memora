import { Redis } from 'ioredis';

import { env } from '@/env';
import { Inject, OnModuleInit } from '@nestjs/common';

import { CACHE_PREFIX_KEY } from '../cache.module';
import { CacheService, GetCacheOptions, SetCacheOptions } from '../cache.service';

export class RedisService extends CacheService implements OnModuleInit {
  client: Redis;

  constructor(
    @Inject(CACHE_PREFIX_KEY) private readonly prefix: string
  ) {
    super();
  }

  async onModuleInit() {
    this.client = new Redis({
      port: env.REDIS_PORT,
      host: env.REDIS_HOST,
      username: env.REDIS_USER,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
    });
  }

  private buildKey(key: string, opts?: { namespace?: string }): string {
    return opts?.namespace ? `${this.prefix}:${opts.namespace}:${key}` : `${this.prefix}:${key}`;
  }

  async get<T = string>(key: string, opts?: GetCacheOptions): Promise<T | null> {
    const redisKey = this.buildKey(key, opts);
    const data = await this.client.get(redisKey);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set<T = string>(key: string, value: T, opts?: SetCacheOptions): Promise<void> {
    const redisKey = this.buildKey(key, opts);
    const serialized = typeof value === "string" ? value : JSON.stringify(value);

    if (opts?.ttl && opts.ttl > 0) {
      await this.client.set(redisKey, serialized, "EX", opts.ttl);
    } else {
      await this.client.set(redisKey, serialized);
    }
  }

}