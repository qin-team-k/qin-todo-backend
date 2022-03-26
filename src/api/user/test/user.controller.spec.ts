import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UserService } from 'src/api/user/user.service';
import { AuthenticateGuard } from 'src/common/guards/authenticate/authenticate.guard';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../../cloud-storage/cloud-storage.service';
import { UserController } from '../user.controller';
import { UpdateUserDto } from './../dto/update-user.dto';
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
  describe('getUser', () => {
    describe('when users is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await controller.users(userStub());
      });

      // 戻り値がuserであるか確認
      it('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  // updateUserのテスト
  describe('updateUser', () => {
    describe('then it when updateUser is called', () => {
      let user: User;
      let updateUserDto: UpdateUserDto;

      beforeEach(async () => {
        updateUserDto = {
          username: 'Sam Smith',
        };
        user = await controller.updateUser(
          userStub(),
          userStub().id,
          updateUserDto,
        );
      });

      // userServiceのupdateUserが引数(userId, paramUserId, createUserDto)で呼ばれたか確認
      it('should call userService', () => {
        expect(service.updateUser).toBeCalledWith(
          userStub().id,
          userStub().id,
          updateUserDto,
        );
      });

      // 戻り値がuserであるか確認
      it('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  // updateAvatarのテスト
  describe('updateAvatar', () => {
    describe('when updateAvatar is called', () => {
      let user: User;
      let avatarImage: Express.Multer.File;
      let multer;

      // アップデートファイルのmockを作成
      jest.mock('multer', () => {
        multer = () => ({
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
        multer.memoryStorage = () => jest.fn();
        return multer;
      });

      beforeEach(async () => {
        avatarImage = multer;
        user = await controller.updateAvatar(
          userStub(),
          userStub().id,
          avatarImage,
        );
      });

      // userServiceのuploadAvatarImageが引数(userId, paramUserId, createUserDto)で呼ばれたか確認
      it('then it should call userService', () => {
        expect(service.uploadAvatarImage).toBeCalledWith(
          userStub().id,
          userStub().id,
          avatarImage,
        );
      });

      // 戻り値がuserであるか確認
      it('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  // deleteのテスト
  describe('deleteUser', () => {
    describe('when delete is called', () => {
      beforeEach(async () => {
        await service.deleteUser(userStub().id);
      });

      // 戻り値がundefinedであるか確認
      it('then it should be undefined', async () => {
        expect(await controller.delete(userStub())).toBeUndefined();
      });

      // userServiceのupdateUserが引数(userId)で呼ばれたか確認
      it('then it should call userService', () => {
        expect(service.deleteUser).toBeCalledWith(userStub().id);
      });
    });
  });
});
