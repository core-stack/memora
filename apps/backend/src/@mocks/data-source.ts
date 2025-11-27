import { DataSource } from "typeorm";
import { createEntityManagerMock } from "./entity-manager";

export function createDataSourceMock(repo?: any, manager?: any) {
  manager ??= createEntityManagerMock(repo);
  return {
    manager,
    getRepository: repo ? jest.fn(() => repo) : jest.fn(),
    createEntityManager: jest.fn(() => manager),

    transaction: jest.fn(async (cb: any) => {
      return cb(manager);
    }),

    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager
    }))
  } as unknown as jest.Mocked<DataSource>;
}
