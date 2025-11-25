import { ObjectLiteral, Repository } from "typeorm";

export function createRepositoryMock<T extends ObjectLiteral = any>(): jest.Mocked<Repository<T>> {
  return {
    // Base properties
    target: jest.fn() as any,
    manager: jest.fn() as any,
    metadata: jest.fn() as any,
    queryRunner: undefined,

    // CRUD
    find: jest.fn(),
    findBy: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findOneOrFail: jest.fn(),
    findOneByOrFail: jest.fn(),
    findAndCount: jest.fn(),
    findAndCountBy: jest.fn(),
    findByIds: jest.fn(),

    // Save/Insert/Update/Delete
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),

    // Querying
    createQueryBuilder: jest.fn(),
    createQueryRunner: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    preload: jest.fn(),

    // Counting
    count: jest.fn(),
    countBy: jest.fn(),
    exist: jest.fn(),
    exists: jest.fn() as any,

    // Aggregation
    increment: jest.fn(),
    decrement: jest.fn(),

    // Raw queries
    query: jest.fn(),

    // Other utils
    clear: jest.fn(),
    extend: jest.fn()
  } as any;
}
