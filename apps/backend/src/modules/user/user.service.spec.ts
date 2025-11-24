import { Repository, DataSource } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserEntity } from "../../entities/user.entity";
import { FilterOptions } from "@/shared/filter-options";

describe("UserService", () => {
  let service: UserService;
  let repositoryMock: jest.Mocked<Repository<UserEntity>>;
  let dataSourceMock: jest.Mocked<DataSource>;
  // let managerMock: jest.Mocked<EntityManager>;
  let contextMock: any;

  beforeEach(() => {
    repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    // managerMock = {
    //   getRepository: jest.fn().mockReturnValue(repositoryMock)
    // } as any;

    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue(repositoryMock),
      transaction: jest.fn()
    } as any;

    contextMock = {
      session: undefined
    };

    service = new UserService();

    // Inject mocks into the service
    (service as any).dataSource = dataSourceMock;
    (service as any).context = contextMock;
  });

  // -------------------------------------------
  // findWithMemberRoleTenant
  // -------------------------------------------
  test("findWithMemberRoleTenant() should call repository.find() with extra relations", async () => {
    const filter = new FilterOptions<UserEntity>({ where: { id: "1" } });

    repositoryMock.find.mockResolvedValue([ { id: "1" } as UserEntity ]);

    const result = await service.findWithMemberRoleTenant(filter);

    expect(repositoryMock.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "1" },
        relations: [ "role", "members", "members.role", "members.tenant" ]
      })
    );

    expect(result[0].id).toBe("1");
  });

  // -------------------------------------------
  // findFirstWithMemberRoleTenant
  // -------------------------------------------
  test("findFirstWithMemberRoleTenant() should call repository.findOne() with extra relations", async () => {
    const filter = new FilterOptions<UserEntity>({ where: { email: "test@example.com" } });

    repositoryMock.findOne.mockResolvedValue({ id: "99" } as UserEntity);

    const result = await service.findFirstWithMemberRoleTenant(filter);

    expect(repositoryMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "test@example.com" },
        relations: [ "role", "members", "members.role", "members.tenant" ]
      })
    );

    expect(result?.id).toBe("99");
  });

  // -------------------------------------------
  // self()
  // -------------------------------------------

  test("self() should throw Unauthorized when session is missing", async () => {
    contextMock.session = undefined;

    await expect(service.self()).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test("self() should throw Unauthorized when user.id is missing", async () => {
    contextMock.session = { user: {} };

    await expect(service.self()).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test("self() should throw Unauthorized when user not found", async () => {
    contextMock.session = { user: { id: "abc" } };

    repositoryMock.findOne.mockResolvedValue(null);

    await expect(service.self()).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test("self() should return the user when found", async () => {
    contextMock.session = { user: { id: "123" } };

    const user = { id: "123", name: "John" } as UserEntity;

    repositoryMock.findOne.mockResolvedValue(user);

    const result = await service.self();

    expect(repositoryMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "123" },
        relations: [ "role", "members", "members.role", "members.tenant" ]
      })
    );

    expect(result).toEqual(user);
  });
});
