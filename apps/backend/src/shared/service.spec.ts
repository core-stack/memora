import { EntityManager, Repository, DataSource } from "typeorm";
import { Service } from "./service";
import { FilterOptions } from "./filter-options";
import { Logger } from "@nestjs/common";

class TestEntity {
  id!: string;
  name!: string;
}

class TestService extends Service<TestEntity> {
  entity = TestEntity;
  logger = new Logger();
}

describe("Service", () => {
  let service: TestService;
  let dataSourceMock: jest.Mocked<DataSource>;
  let managerMock: jest.Mocked<EntityManager>;
  let repositoryMock: jest.Mocked<Repository<TestEntity>>;

  beforeEach(() => {
    repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    managerMock = {
      getRepository: jest.fn().mockReturnValue(repositoryMock)
    } as any;

    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue(repositoryMock),
      transaction: jest.fn()
    } as any;

    service = new TestService();
    (service as any).dataSource = dataSourceMock;
  });

  // --------------------
  // TRANSACTION
  // --------------------

  test("should execute callback inside provided manager", async () => {
    const callback = jest.fn().mockResolvedValue("OK");

    const result = await service.transaction(callback, managerMock);

    expect(callback).toHaveBeenCalledWith(managerMock);
    expect(result).toBe("OK");
    expect(dataSourceMock.transaction).not.toHaveBeenCalled();
  });

  // --------------------
  // FETCH METHODS
  // --------------------

  test("find() should delegate to repository.find()", async () => {
    const filter = new FilterOptions<TestEntity>({});
    repositoryMock.find.mockResolvedValue([ { id: "1", name: "John" } ]);

    const result = await service.find(filter);

    expect(repositoryMock.find).toHaveBeenCalledWith(filter);
    expect(result.length).toBe(1);
  });

  test("findUnique() should call findOneOrFail()", async () => {
    const filter = new FilterOptions<TestEntity>({});
    repositoryMock.findOneOrFail.mockResolvedValue({ id: "1", name: "John" });

    const result = await service.findUnique(filter);

    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith(filter);
    expect(result!.id).toBe("1");
  });

  test("findFirst() should force take=1 and skip=0", async () => {
    const filter = new FilterOptions<TestEntity>({});
    repositoryMock.find.mockResolvedValue([ { id: "2", name: "Alice" } ]);

    const result = await service.findFirst(filter);

    expect(filter.take).toBe(1);
    expect(filter.skip).toBe(0);
    expect(result!.id).toBe("2");
  });

  test("findFirst() should return null if empty", async () => {
    const filter = new FilterOptions<TestEntity>({});
    repositoryMock.find.mockResolvedValue([]);

    const result = await service.findFirst(filter);

    expect(result).toBeNull();
  });

  test("findByID() should build where clause with id", async () => {
    repositoryMock.findOne.mockResolvedValue({ id: "123", name: "Alex" });

    const result = await service.findByID("123");

    expect(repositoryMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "123" }
      })
    );
    expect(result!.name).toBe("Alex");
  });

  // --------------------
  // CRUD
  // --------------------

  test("create() should call repository.save()", async () => {
    const input = { id: "99", name: "Bob" };
    repositoryMock.save.mockResolvedValue(input);

    const result = await service.create(input);

    expect(repositoryMock.save).toHaveBeenCalledWith(input);
    expect(result).toEqual(input);
  });

  test("update() should call repository.update()", async () => {
    repositoryMock.update.mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

    await service.update("1", { name: "Updated" });

    expect(repositoryMock.update).toHaveBeenCalledWith("1", { name: "Updated" });
  });

  test("delete() should call repository.delete()", async () => {
    repositoryMock.delete.mockResolvedValue({ raw: [], affected: 1 });

    await service.delete("5");

    expect(repositoryMock.delete).toHaveBeenCalledWith("5");
  });

  // --------------------
  // REPOSITORY SELECTION
  // --------------------

  test("repository() should use dataSource.getRepository when no manager", () => {
    const repo = service.repository();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(TestEntity);
    expect(repo).toBe(repositoryMock);
  });

  test("repository() should use manager.getRepository when manager given", () => {
    const repo = service.repository(managerMock);
    expect(managerMock.getRepository).toHaveBeenCalledWith(TestEntity);
    expect(repo).toBe(repositoryMock);
  });
});
