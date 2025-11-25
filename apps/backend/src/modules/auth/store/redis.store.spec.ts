import { RedisStore } from "./redis.store";
import Redis from "ioredis";

jest.mock("ioredis");

const mockRedis = () => {
  const redisMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    ttl: jest.fn(),
    scan: jest.fn(),
    mget: jest.fn()
  };

  (Redis as unknown as jest.Mock).mockImplementation(() => redisMock);
  return redisMock;
};

describe("RedisStore", () => {
  let store: RedisStore<any>;
  let redis: ReturnType<typeof mockRedis>;

  beforeEach(() => {
    jest.clearAllMocks();
    redis = mockRedis();

    store = new RedisStore({
      url: "redis://localhost:6379",
      prefix: "auth"
    });
  });

  // ----------------------------------------------------
  // GET
  // ----------------------------------------------------
  it("should return parsed value on get", async () => {
    redis.get.mockResolvedValue(JSON.stringify({ x: 1 }));

    const res = await store.get("abc");
    expect(res).toEqual({ x: 1 });
    expect(redis.get).toHaveBeenCalledWith("auth:abc");
  });

  it("should return null when key does not exist", async () => {
    redis.get.mockResolvedValue(null);

    const res = await store.get("missing");
    expect(res).toBeNull();
  });

  // ----------------------------------------------------
  // SET: EXPIRY
  // ----------------------------------------------------
  it("should set value with EX expiration if expiry is provided", async () => {
    await store.set("abc", { v: 1 }, { expiry: 5000 });

    expect(redis.set).toHaveBeenCalledWith(
      "auth:abc",
      JSON.stringify({ v: 1 }),
      "EX",
      5 // expiry in seconds
    );
  });

  // ----------------------------------------------------
  // SET: KEEP TTL
  // ----------------------------------------------------
  it("should preserve existing TTL when no expiry is passed and TTL > 0", async () => {
    redis.ttl.mockResolvedValue(60);

    await store.set("abc", { v: 2 });

    expect(redis.ttl).toHaveBeenCalledWith("auth:abc");
    expect(redis.set).toHaveBeenCalledWith(
      "auth:abc",
      JSON.stringify({ v: 2 }),
      "KEEPTTL"
    );
  });

  // ----------------------------------------------------
  // SET: NO TTL
  // ----------------------------------------------------
  it("should set value without TTL when no existing TTL", async () => {
    redis.ttl.mockResolvedValue(-2); // Redis: -2 = no key or expired

    await store.set("abc", { v: 3 });

    expect(redis.set).toHaveBeenCalledWith(
      "auth:abc",
      JSON.stringify({ v: 3 })
    );
  });

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------
  it("should delete a key", async () => {
    await store.delete("abc");
    expect(redis.del).toHaveBeenCalledWith("auth:abc");
  });

  // ----------------------------------------------------
  // GET MANY
  // ----------------------------------------------------
  it("should return paginated items using scan + mget", async () => {
    redis.scan.mockResolvedValue([
      "5", // next cursor
      [ "auth:a", "auth:b", "auth:c" ]
    ]);

    redis.mget.mockResolvedValue([
      JSON.stringify({ a: 1 }),
      JSON.stringify({ b: 2 }),
      JSON.stringify({ c: 3 })
    ]);

    const result = await store.getMany(0, 10);

    expect(result).toEqual({
      cursor: 5,
      items: [ { a: 1 }, { b: 2 }, { c: 3 } ]
    });

    expect(redis.scan).toHaveBeenCalledWith(
      0,
      "MATCH",
      "auth:*",
      "COUNT",
      10
    );
  });

  it("should filter out null values returned by mget", async () => {
    redis.scan.mockResolvedValue([ "0", [ "auth:a", "auth:b" ] ]);
    redis.mget.mockResolvedValue([
      JSON.stringify({ a: 1 }),
      null // missing key or expired
    ]);

    const result = await store.getMany(0, 10);

    expect(result.items).toEqual([ { a: 1 } ]);
  });

  it("should return empty result if scan finds no keys", async () => {
    redis.scan.mockResolvedValue([ "0", [] ]);

    const result = await store.getMany(0, 10);

    expect(result).toEqual({
      cursor: 0,
      items: []
    });
  });

  // ----------------------------------------------------
  // GET ALL
  // ----------------------------------------------------
  it("should keep scanning until cursor returns 0", async () => {
    redis.scan
      .mockResolvedValueOnce([
        "4",
        [ "auth:a", "auth:b" ]
      ])
      .mockResolvedValueOnce([
        "0",
        [ "auth:c" ]
      ]);

    redis.mget
      .mockResolvedValueOnce([
        JSON.stringify({ a: 1 }),
        JSON.stringify({ b: 2 })
      ])
      .mockResolvedValueOnce([
        JSON.stringify({ c: 3 })
      ]);

    const result = await store.getAll();

    expect(result).toEqual([ { a: 1 }, { b: 2 }, { c: 3 } ]);
  });
});
