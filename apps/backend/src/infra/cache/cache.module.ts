import { DynamicModule, Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { RedisService } from './redis/redis.service';

export const CACHE_PREFIX_KEY = Symbol("cache_prefix_key");

@Module({})
export class CacheModule {
  static register(prefix: string): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHE_PREFIX_KEY,
          useValue: prefix
        },
        {
          provide: CacheService,
          inject: [CACHE_PREFIX_KEY],
          useFactory: (prefix: string) => new RedisService(prefix)
        }
      ],
      exports: [CacheService]
    }
  }
}
