import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UserService } from 'src/api/user/user.service';
import { resetDatabase } from 'src/common/helper/resetDatabase';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from './../cloud-storage/cloud-storage.service';
import { UserController } from './user.controller';

let controller: UserController;
const user: User = {
  id: 'eb14ff64-a2c2-4455-0da5-c3c1e575cd62',
  uid: 'ofKQXPnq0VUwk0r15tHcvHXVTrad',
  username: 'Jane Smith',
  email: 'jane@example.com',
  avatarUrl:
    'https://gravatar.com/avatar/3cb5628734a944573d67a5871b1dcbfb?s=400&d=robohash&r=x',
  createdAt: new Date('2020-06-01T00:00:00.000Z'),
  updatedAt: new Date('2020-06-01T00:00:00.000Z'),
};

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: [UserService, PrismaService, CloudStorageService],
  }).compile();

  controller = module.get<UserController>(UserController);
});

beforeEach(async () => {
  await resetDatabase();
});

// UserServiceのテスト
describe('UserController', () => {
  it('can create an instance of user controller', async () => {
    expect(controller).toBeDefined();
  });
});

describe('FindUser', () => {
  it('Normal case: should return a user', () => {
    controller.users(user);
  });
});
