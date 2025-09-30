export type CacheOptions = {
  namespace?: string;
}

export type GetCacheOptions = CacheOptions & {}

export type SetCacheOptions = CacheOptions & {
  ttl?: number;
}

export abstract class CacheService {
  abstract get<T = string>(key: string, opts?: GetCacheOptions): Promise<T | null>;
  abstract set<T = string>(key: string, value: T, opts?: SetCacheOptions): Promise<void>;
}
