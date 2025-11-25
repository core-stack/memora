export function createEntityManagerMock(repo?: any) {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    query: jest.fn(),
    insert: jest.fn(),
    count: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    createQueryBuilder: jest.fn(),
    getRepository: repo ? jest.fn(() => repo) : jest.fn()
  };
}
