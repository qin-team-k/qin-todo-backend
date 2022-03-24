import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { resetDatabase } from 'src/common/helper/resetDatabase';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { UserService } from './user.service';

let service: UserService;
let prisma: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, CloudStorageService, UserService],
  }).compile();

  service = module.get(UserService);
  prisma = module.get(PrismaService);
});

beforeEach(async () => {
  await resetDatabase();
});

// テストデータ
const createUserDto = {
  email: 'jane@example.com',
  name: 'Jane Smith',
  avatarUrl:
    'https://gravatar.com/avatar/ff3bd3d6733b66d9bf8361c8c8b47147?s=400&d=robohash&r=x',
  uid: '0e7eaf56-1eed-4dea-b791-2d51efaffc59',
};

const userId = '24b7282f-9d30-450b-8383-758ec0506b4d';
const paramUserId = '12345';
const updateUserDto = {
  username: 'Jane Smith',
};

// UserServiceのテスト
describe('UserService', () => {
  it('can create an instance of user service', async () => {
    expect(service).toBeDefined();
  });
});

// initUserメソッドのテスト
describe('InitUser', () => {
  it('Normal case: creates a new user with Google auth and get creates todoOrderTable', async () => {
    const user = await service.initUser(createUserDto);
    // initUser後のデータを確認
    expect(user.uid).toEqual(createUserDto.uid);
    expect(user.email).toEqual(createUserDto.email);
    expect(user.username).toEqual(createUserDto.name);
    expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);
  });
});

// updateUserメソッドのテスト
describe('UpdateUser', () => {
  it('Normal case: throws an error if userId and paramUserId is not equal when update username', async () => {
    await expect(
      service.updateUser(userId, paramUserId, updateUserDto),
    ).rejects.toThrowError(ForbiddenException);
  });
});
