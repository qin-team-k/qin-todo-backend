import { Test, TestingModule } from '@nestjs/testing';
import { resetDatabase } from 'src/common/helper/resetDatabase';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { UserService } from './user.service';

// UserServiceのテスト
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, CloudStorageService, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  // controllerインスタンス作成のテスト
  it('can create an instance of user controller', async () => {
    expect(service).toBeDefined();
  });
});
