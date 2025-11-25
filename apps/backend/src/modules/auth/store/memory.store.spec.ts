import { MemoryStore } from "./memory.store";

describe("MemoryStore", () => {
  let store: MemoryStore<any>;
  const realNow = Date.now;

  beforeEach(() => {
    store = new MemoryStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    Date.now = realNow;
  });

  const mockNow = (ms: number) => {
    Date.now = jest.fn(() => ms);
  };

  // -------------------------------------------------
  // SET / GET
  // -------------------------------------------------
  it("should set and get", () => {
    store.set("a", { test: 123 });
    expect(store.get("a")).toEqual({ test: 123 });
  });

  it("should return null for unknown key", () => {
    expect(store.get("unknown")).toBeNull();
  });

  // -------------------------------------------------
  // EXPIRATION
  // -------------------------------------------------
  it("should expire", () => {
    mockNow(1000);
    store.set("a", { x: 1 }, { expiry: 500 });

    mockNow(1499);
    expect(store.get("a")).toEqual({ x: 1 });

    mockNow(1501);
    expect(store.get("a")).toBeNull();
  });

  it("should clean expired", async () => {
    mockNow(1000);

    store.set("a", 1, { expiry: 200 });
    store.set("b", 2);
    store.set("c", 3, { expiry: 100 });

    mockNow(1201);
    await store.getAll();

    expect(store.get("c")).toBeNull();
    expect(store.get("a")).toBeNull();
    expect(store.get("b")).not.toBeNull();
  });

  // -------------------------------------------------
  // DELETE
  // -------------------------------------------------
  it("should delete", () => {
    store.set("a", 123);
    store.delete("a");
    expect(store.get("a")).toBeNull();
  });

  // -------------------------------------------------
  // GET MANY (pagination)
  // -------------------------------------------------
  it("should get many", async () => {
    store.set("k1", 1);
    store.set("k2", 2);
    store.set("k3", 3);
    store.set("k4", 4);

    const page1 = await store.getMany(0, 2);
    expect(page1.items).toEqual([ 1, 2 ]);
    expect(page1.cursor).toBe(2);

    const page2 = await store.getMany(page1.cursor, 2);
    expect(page2.items).toEqual([ 3, 4 ]);
    expect(page2.cursor).toBe(-1);
  });

  it("should return cursor = -1 when there are no more items", async () => {
    store.set("a", 10);
    store.set("b", 20);

    const r = await store.getMany(5, 10);
    expect(r.cursor).toBe(-1);
    expect(r.items).toEqual([]);
  });

  it("should return only non-expired", async () => {
    mockNow(1000);
    store.set("a", 1, { expiry: 200 });
    store.set("b", 2);
    store.set("c", 3);

    mockNow(1300);

    const result = await store.getMany(0, 10);
    expect(result.items).toEqual([ 2, 3 ]);
  });

  // -------------------------------------------------
  // GET ALL
  // -------------------------------------------------
  it("should return only non-expired", async () => {
    mockNow(1000);
    store.set("a", 1);
    store.set("b", 2, { expiry: 300 });

    mockNow(1400);

    const result = await store.getAll();
    expect(result).toEqual([ 1 ]);
  });
});
