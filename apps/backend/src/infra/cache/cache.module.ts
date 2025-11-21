import { DynamicModule, Module } from "@nestjs/common";

import { CacheService } from "./cache.service";
import { CACHE_PREFIX_KEY } from "./prefix";
import { RedisService } from "./redis/redis.service";

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
          useClass: RedisService
        }
      ],
      exports: [ CacheService ]
    };
  }
}
