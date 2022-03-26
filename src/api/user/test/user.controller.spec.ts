import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/api/user/user.service';
import { AuthenticateGuard } from 'src/common/guards/authenticate/authenticate.guard';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../../cloud-storage/cloud-storage.service';
import { UserController } from '../user.controller';

/**
 * jestにuserServiceをmockすることを伝えると、自動的にspy.onされてるらしい。
 * 通常のuserServiceの代わりに__mocks__内のuserServiceが使われる。
 */
jest.mock('../user.service.ts');

// UserControllerのテスト
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        CloudStorageService,
        {
          provide: AuthenticateGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    // mockをクリアする
    jest.clearAllMocks();
  });

  // controllerインスタンス作成のテスト
  it('can create an instance of user controller', async () => {
    expect(controller).toBeDefined();
  });
});
