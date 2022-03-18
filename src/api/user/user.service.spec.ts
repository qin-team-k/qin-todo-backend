import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const createUserDto = {
    email: 'tom@example.com',
    name: 'tom cruise',
    avatarUrl:
      'https://gravatar.com/avatar/ff3bd3d6733b66d9bf8361c8c8b47147?s=400&d=robohash&r=x',
    uid: '0e7eaf56-1eed-4dea-b791-2d51efaffc59',
  };

  const createdAt = new Date('2020-06-01T00:00:00.000Z');
  const updatedAt = new Date('2020-06-01T00:00:00.000Z');

  // beforeAll(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [UserService, PrismaService, CloudStorageService],
  //   }).compile();

  //   service = module.get<UserService>(UserService);
  // });

  beforeEach(async () => {
    // mockのUserサービスを作成
    const mockUserService: Partial<UserService> = {
      initUser: jest.fn((createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: '24b7282f-9d30-450b-8383-758ec0506b4d',
          uid: createUserDto.uid,
          username: createUserDto.name,
          email: createUserDto.email,
          avatarUrl: createUserDto.avatarUrl,
          createdAt,
          updatedAt,
        }),
      ),
      updateUsername: jest.fn(
        (userId: string, paramUserId: string, username: string) =>
          Promise.resolve({
            id: userId,
            uid: createUserDto.uid,
            username,
            email: createUserDto.email,
            avatarUrl: createUserDto.avatarUrl,
            createdAt,
            updatedAt,
          }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        CloudStorageService,
        UserService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('can create an instance of user service', async () => {
    expect(service).toBeDefined();
  });

  // FIXME todoOrderテーブルが作成されかをテストしたい
  it('Normal case: creates a new user with Google auth and get creates todoOrderTable', async () => {
    const user = await service.initUser(createUserDto);
    // initUser後のデータを確認
    expect(user.uid).toEqual(createUserDto.uid);
    expect(user.email).toEqual(createUserDto.email);
    expect(user.username).toEqual(createUserDto.name);
    expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);
  });

  // FIXME resolveしてしまう
  it('Normal case: throws an error if userId and paramUserId is not equal when update username', async () => {
    const userId = '24b7282f-9d30-450b-8383-758ec0506b4d';
    const paramUserId = '123';
    const username = 'Jane Doe';

    await expect(
      service.updateUsername(userId, paramUserId, username),
    ).rejects.toThrowError(ForbiddenException);
  });
});
