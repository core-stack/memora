export type StoreOptions = {
  expiry?: number;
};

export abstract class Store<T> {
  abstract get(key: string): Promise<T | null> | T | null;
  abstract set(key: string, value: T, opts?: StoreOptions): Promise<void> | void;
  abstract delete(key: string): Promise<void> | void;
  abstract getAll(): Promise<T[]>;
  abstract getMany(cursor: number, limit: number): Promise<{ cursor: number, items: T[] }>;
}
