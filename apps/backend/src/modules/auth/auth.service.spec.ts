import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthManager } from './auth-manager.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { VerificationTokenService } from '../verification-token/verification-token.service';
import { getQueueToken } from '@nestjs/bullmq';
import { JobType } from '../../jobs/types';
import { DataSource } from 'typeorm';
import { HTTPContext } from '../../shared/http-context/http-context';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '../../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleEntity } from '../../entities/role.entity';
import { ROLES } from '@snipet/permission';
import { RoleScope } from '../../entities/role.entity';
import { env } from '../../env';
import { VerificationTokenEntity, VerificationType } from '../../entities/verification-token.entity';
import moment from 'moment';
import { randomUUID } from 'crypto';

describe('AuthService', () => {
  let service: AuthService;
  let authManager: jest.Mocked<AuthManager>;
  let userService: jest.Mocked<UserService>;
  let roleService: jest.Mocked<RoleService>;
  let verificationTokenService: jest.Mocked<VerificationTokenService>;
  let sendMailQueue: { add: jest.Mock };
  let httpContext: jest.Mocked<HTTPContext>;

  const mockAuthManager = {
    createSessionAndTokens: jest.fn(),
  };

  const mockUserService = {
    find: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findByID: jest.fn(),
    update: jest.fn(),
    findFirstWithMemberRoleTenant: jest.fn(),
  };

  const mockRoleService = {
    findUnique: jest.fn(),
  };

  const mockVerificationTokenService = {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  };

  const mockSendMailQueue = {
    add: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      return callback({});
    }),
  };

  const mockHttpContext = {
    setCookie: jest.fn(),
    deleteCookies: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthManager, useValue: mockAuthManager },
        { provide: UserService, useValue: mockUserService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: VerificationTokenService, useValue: mockVerificationTokenService },
        {
          provide: getQueueToken(JobType.SEND_EMAIL),
          useValue: mockSendMailQueue,
        },
        { provide: DataSource, useValue: mockDataSource },
        { provide: HTTPContext, useValue: mockHttpContext },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authManager = module.get(AuthManager);
    userService = module.get(UserService);
    roleService = module.get(RoleService);
    verificationTokenService = module.get(VerificationTokenService);
    sendMailQueue = module.get(getQueueToken(JobType.SEND_EMAIL));
    httpContext = module.get(HTTPContext);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
    };

    it('should throw BadRequestException if email is already in use', async () => {
      userService.find.mockResolvedValue([new UserEntity({ email: createAccountDto.email })]);
      await expect(service.createAccount(createAccountDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if role is not found', async () => {
      userService.find.mockResolvedValue([]);
      roleService.findUnique.mockResolvedValue(null);
      await expect(service.createAccount(createAccountDto)).rejects.toThrow(NotFoundException);
    });

    it('should create a new user without email verification', async () => {
      env.REQUIRE_EMAIL_VERIFICATION = false;
      const role = new RoleEntity({ id: randomUUID(), key: ROLES.global.user.key, scope: RoleScope.GLOBAL });
      const user = new UserEntity({ id: randomUUID(), ...createAccountDto });

      userService.find.mockResolvedValue([]);
      roleService.findUnique.mockResolvedValue(role);
      userService.create.mockResolvedValue(user);

      await service.createAccount(createAccountDto);

      expect(userService.create).toHaveBeenCalled();
      expect(verificationTokenService.create).not.toHaveBeenCalled();
      expect(sendMailQueue.add).not.toHaveBeenCalled();
    });

    it('should create a new user with email verification', async () => {
      env.REQUIRE_EMAIL_VERIFICATION = true;
      const role = new RoleEntity({ id: randomUUID(), key: ROLES.global.user.key, scope: RoleScope.GLOBAL });
      const user = new UserEntity({ id: randomUUID(), ...createAccountDto });

      userService.find.mockResolvedValue([]);
      roleService.findUnique.mockResolvedValue(role);
      userService.create.mockResolvedValue(user);
      verificationTokenService.create.mockResolvedValue({ token: 'token' } as any);

      await service.createAccount(createAccountDto);

      expect(userService.create).toHaveBeenCalled();
      expect(verificationTokenService.create).toHaveBeenCalled();
      expect(sendMailQueue.add).toHaveBeenCalled();
    });
  });

  describe('activeAccount', () => {
    const activeAccountDto = { token: 'some-token' };

    it('should throw BadRequestException if activation link is invalid', async () => {
      verificationTokenService.findFirst.mockResolvedValue(null);
      await expect(service.activeAccount(activeAccountDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const verificationToken = new VerificationTokenEntity({ userId: randomUUID() });
      verificationTokenService.findFirst.mockResolvedValue(verificationToken);
      userService.findByID.mockResolvedValue(null);
      await expect(service.activeAccount(activeAccountDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if activation link is expired', async () => {
      const verificationToken = new VerificationTokenEntity({
        userId: randomUUID(),
        type: VerificationType.ACTIVE_ACCOUNT,
        expires: moment().subtract(1, 'day').toDate(),
      });
      const user = new UserEntity({ id: randomUUID(), email: 'test@example.com' });
      verificationTokenService.findFirst.mockResolvedValue(verificationToken);
      userService.findByID.mockResolvedValue(user);
      verificationTokenService.create.mockResolvedValue({ token: 'new-token' } as any);

      await expect(service.activeAccount(activeAccountDto)).rejects.toThrow(BadRequestException);
      expect(verificationTokenService.delete).toHaveBeenCalledWith(activeAccountDto.token, expect.anything());
      expect(userService.update).toHaveBeenCalledWith(user.id, expect.anything(), expect.anything());
      expect(verificationTokenService.create).toHaveBeenCalledWith(expect.anything(), expect.anything());
      expect(sendMailQueue.add).toHaveBeenCalled();
    });

    it('should activate account successfully', async () => {
      const verificationToken = new VerificationTokenEntity({
        userId: randomUUID(),
        expires: moment().add(1, 'day').toDate(),
        type: VerificationType.ACTIVE_ACCOUNT,
        token: activeAccountDto.token,
      });
      const user = new UserEntity({ id: randomUUID(), email: 'test@example.com' });
      verificationTokenService.findFirst.mockResolvedValue(verificationToken);
      userService.findByID.mockResolvedValue(user);

      await service.activeAccount(activeAccountDto);

      expect(verificationTokenService.delete).toHaveBeenCalledWith(activeAccountDto.token, expect.anything());
      expect(userService.update).toHaveBeenCalledWith(user.id, expect.anything(), expect.anything());
    });
  });

  describe('forgetPassword', () => {
    const forgetPasswordDto = { email: 'test@example.com' };

    it('should throw NotFoundException if user is not found', async () => {
      userService.findUnique.mockResolvedValue(null);
      await expect(service.forgetPassword(forgetPasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should send forget password email successfully', async () => {
      const user = new UserEntity({ id: randomUUID(), email: forgetPasswordDto.email });
      userService.findUnique.mockResolvedValue(user);
      verificationTokenService.create.mockResolvedValue({ token: 'token' } as any);

      await service.forgetPassword(forgetPasswordDto);

      expect(verificationTokenService.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: user.id, type: VerificationType.RESET_PASSWORD }),
        expect.anything()
      );
      expect(sendMailQueue.add).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password' };

    it('should throw NotFoundException if user is not found', async () => {
      userService.findFirstWithMemberRoleTenant.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user has no password', async () => {
      const user = new UserEntity({ email: loginDto.email });
      userService.findFirstWithMemberRoleTenant.mockResolvedValue(user);
      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if password does not match', async () => {
      const user = new UserEntity({ email: loginDto.email });
      await user.setPassword("wrong-password");
      jest.spyOn(user, 'comparePassword').mockResolvedValue(false);
      userService.findFirstWithMemberRoleTenant.mockResolvedValue(user);
      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should login successfully', async () => {
      const user = new UserEntity({ email: loginDto.email });
      await user.setPassword("password");
      jest.spyOn(user, 'comparePassword').mockResolvedValue(true);
      userService.findFirstWithMemberRoleTenant.mockResolvedValue(user);
      authManager.createSessionAndTokens.mockResolvedValue({
        token: {
          accessToken: 'access-token',
          accessTokenDuration: 3600,
          refreshToken: 'refresh-token',
          refreshTokenDuration: 86400,
        },
      } as any);

      const result = await service.login(loginDto);

      expect(authManager.createSessionAndTokens).toHaveBeenCalledWith(user);
      expect(mockHttpContext.setCookie).toHaveBeenCalledWith('access-token', 'access-token', expect.any(Object));
      expect(mockHttpContext.setCookie).toHaveBeenCalledWith('refresh-token', 'refresh-token', expect.any(Object));
      expect(result).toEqual({ redirect: '/' });
    });
  });

  describe('logout', () => {
    it('should delete cookies', async () => {
      await service.logout();
      expect(httpContext.deleteCookies).toHaveBeenCalledWith(['access-token', 'refresh-token']);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = { token: 'some-token', password: 'new-password' };

    it('should throw BadRequestException if reset password link is invalid', async () => {
      verificationTokenService.findFirst.mockResolvedValue(null);
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found in verification token', async () => {
      const verificationToken = new VerificationTokenEntity({ token: resetPasswordDto.token });
      verificationTokenService.findFirst.mockResolvedValue(verificationToken);
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should reset password successfully', async () => {
      const user = new UserEntity({ id: randomUUID() });
      const verificationToken = new VerificationTokenEntity({ token: resetPasswordDto.token, user });
      verificationTokenService.findFirst.mockResolvedValue(verificationToken);
      jest.spyOn(user, 'setPassword').mockResolvedValue(user);

      await service.resetPassword(resetPasswordDto);

      expect(userService.update).toHaveBeenCalledWith(user.id, user, expect.anything());
      expect(verificationTokenService.delete).toHaveBeenCalledWith(resetPasswordDto.token, expect.anything());
    });
  });
});
