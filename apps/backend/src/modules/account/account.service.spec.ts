import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from '../../entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { RoleEntity } from '../../entities/role.entity';
import { ROLES } from '@snipet/permission';
import { RoleScope } from '../../entities/role.entity';
import { NotFoundException } from '@nestjs/common';
import { HTTPContext } from '../../shared/http-context/http-context';
import { ClsService } from 'nestjs-cls';
import { randomUUID } from 'crypto';

describe('AccountService', () => {
  let service: AccountService;
  let userService: jest.Mocked<UserService>;
  let roleService: jest.Mocked<RoleService>;
  let accountRepository: jest.Mocked<Repository<AccountEntity>>;

  const mockUserService = {
    findUnique: jest.fn(),
  };

  const mockRoleService = {
    findUnique: jest.fn(),
  };

  const mockAccountRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    manager: {
      transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          getRepository: () => mockAccountRepository,
        });
      }),
    },
    getRepository: () => mockAccountRepository,
  };

  const mockHttpContext = {
    get: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      return callback({
        getRepository: () => mockAccountRepository,
      });
    }),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: UserService, useValue: mockUserService },
        { provide: RoleService, useValue: mockRoleService },
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: mockAccountRepository,
        },
        { provide: HTTPContext, useValue: mockHttpContext },
        { provide: ClsService, useValue: mockClsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    userService = module.get(UserService);
    roleService = module.get(RoleService);
    accountRepository = module.get(getRepositoryToken(AccountEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIfNotExists', () => {
    const createAccountDto = {
      email: 'test@example.com',
      provider: 'google',
      providerAccountId: '123',
      name: 'Test User',
      image: 'test.jpg',
      emailVerified: true,
    };

    it('should return an existing account if found', async () => {
      const existingAccount = new AccountEntity({ id: randomUUID(), ...createAccountDto });

      accountRepository.findOne.mockResolvedValue(existingAccount);

      const result = await service.createIfNotExists(createAccountDto);

      expect(result).toBe(existingAccount);
      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { user: { email: createAccountDto.email } },
        relations: ['user'],
      });
    });

    it('should create a new user and account if user does not exist', async () => {
      const role = new RoleEntity({ id: randomUUID(), key: ROLES.global.user.key, scope: RoleScope.GLOBAL });
      const newAccount = new AccountEntity({ id: randomUUID(), ...createAccountDto });

      accountRepository.findOne.mockResolvedValue(null);
      userService.findUnique.mockResolvedValue(null);
      roleService.findUnique.mockResolvedValue(role);
      accountRepository.save.mockResolvedValue(newAccount);

      const result = await service.createIfNotExists(createAccountDto);

      expect(result).toBe(newAccount);
      expect(userService.findUnique).toHaveBeenCalledWith({ where: { email: createAccountDto.email } });
      expect(roleService.findUnique).toHaveBeenCalledWith({
        where: { key: ROLES.global.user.key, scope: RoleScope.GLOBAL }
      }, expect.anything());
      expect(accountRepository.save).toHaveBeenCalledWith(expect.any(AccountEntity));
    });

    it('should create an account for an existing user', async () => {
      const user = new UserEntity({ id: randomUUID(), email: createAccountDto.email });
      const newAccount = new AccountEntity({ id: randomUUID(), ...createAccountDto, userId: user.id });

      accountRepository.findOne.mockResolvedValue(null);
      userService.findUnique.mockResolvedValue(user);
      accountRepository.save.mockResolvedValue(newAccount);

      const result = await service.createIfNotExists(createAccountDto);

      expect(result).toBe(newAccount);
      expect(userService.findUnique).toHaveBeenCalledWith({ where: { email: createAccountDto.email } });
      expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        provider: createAccountDto.provider,
        providerAccountId: createAccountDto.providerAccountId,
        userId: user.id,
      }));
    });

    it('should throw NotFoundException if role is not found', async () => {
      accountRepository.findOne.mockResolvedValue(null);
      userService.findUnique.mockResolvedValue(null);
      roleService.findUnique.mockResolvedValue(null);

      await expect(service.createIfNotExists(createAccountDto)).rejects.toThrow(NotFoundException);
    });
  });
});
