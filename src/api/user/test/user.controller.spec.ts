import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/api/user/user.service';
import { AuthenticateGuard } from 'src/common/guards/authenticate/authenticate.guard';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../../cloud-storage/cloud-storage.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserController } from '../user.controller';
import { userStub } from './stubs/user.stub';

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

  // usersのテスト
  describe('users', () => {
    describe('when users is called', () => {
      // 戻り値がuserであるか確認
      it('then it should return a user', async () => {
        const user = await controller.users(userStub());
        expect(user).toEqual(userStub());
      });
    });
  });

  // updateUserのテスト
  describe('updateUser', () => {
    describe('then it when updateUser is called', () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updated username',
      };

      // controllerで呼び出しているuserServiceのupdateUserが引数(userId, paramUserId, createUserDto)で呼ばれたか確認
      it('should call userService', async () => {
        await controller.updateUser(userStub(), userStub().id, updateUserDto);
        expect(await service.updateUser).toBeCalledWith(
          userStub().id,
          userStub().id,
          updateUserDto,
        );
      });

      // 戻り値がuserであるか確認
      it('then it should return a user', async () => {
        const user = await controller.updateUser(
          userStub(),
          userStub().id,
          updateUserDto,
        );

        const result = userStub();
        result.username = updateUserDto.username;
        expect(user).toEqual(result);
      });
    });
  });

  // updateAvatarのテスト
  describe('updateAvatar', () => {
    describe('when updateAvatar is called', () => {
      let multerAvatarImage;
      const avatarUrl =
        'https://gravatar.com/avatar/updated3cb5628734a944573d67a587asdfasdfafb?s=400&d=robohash&r=x';

      // アップデートファイルのmockを作成
      jest.mock('multer', () => {
        multerAvatarImage = () => ({
          any: () => {
            return (req, _res, next) => {
              req.body = { userName: 'testUser' };
              req.files = [
                {
                  originalname: 'sample.name',
                  mimetype: 'sample.type',
                  path: 'sample.url',
                  buffer: Buffer.from('whatever'),
                },
              ];
              return next();
            };
          },
        });
        multerAvatarImage.memoryStorage = () => jest.fn();
        return multerAvatarImage;
      });

      // controllerで呼び出しているuserServiceのuploadAvatarImageが引数(userId, paramUserId, createUserDto)で呼ばれたか確認
      it('then it should call userService', async () => {
        await controller.updateAvatar(
          userStub(),
          userStub().id,
          multerAvatarImage,
        );
        expect(service.uploadAvatarImage).toBeCalledWith(
          userStub().id,
          userStub().id,
          multerAvatarImage,
        );
      });

      // 戻り値がuserであるか確認
      it('then it should return a user', async () => {
        const user = await controller.updateAvatar(
          userStub(),
          userStub().id,
          multerAvatarImage,
        );

        const result = userStub();
        result.avatarUrl = avatarUrl;
        expect(user).toEqual(result);
      });
    });
  });

  // deleteのテスト
  describe('delete', () => {
    describe('when delete is called', () => {
      // 戻り値がundefinedであるか確認
      it('then it should be undefined', async () => {
        await controller.delete(userStub());
        expect(await service.deleteUser(userStub().id)).toBeUndefined();
      });

      // controllerで呼び出しているuserServiceのupdateUserが引数(userId)で呼ばれたか確認
      it('then it should call userService', async () => {
        await controller.delete(userStub());
        expect(service.deleteUser).toBeCalledWith(userStub().id);
      });
    });
  });
});
