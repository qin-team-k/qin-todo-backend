import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoStatus } from '@prisma/client';
import { resetDatabase } from 'src/common/helper/resetDatabase';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../../cloud-storage/cloud-storage.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../user.service';

// UserServiceのテスト
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  let createUserDto: CreateUserDto;
  let updateUserDto: UpdateUserDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, CloudStorageService, UserService],
    }).compile();

    // テストデータ
    createUserDto = {
      email: 'John@skynet.com',
      name: 'John Conner',
      avatarUrl:
        'https://gravatar.com/avatar/ff3bd3d6733b66d9bf8361c8c8b47147?s=400&d=robohash&r=x',
      uid: '0e7eaf56-1eed-4dea-b791-2d51efaffc59',
    };

    updateUserDto = {
      username: 'Jane Smith',
    };

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

  // TODO findUserByUidのテスト
  // describe('findUserByUid', () => {
  //   it('Normal case: creates a new user', async () => {
  //     const user = await service.createUser(createUserDto);

  //     // createUser後のデータを確認
  //     expect(user.uid).toEqual(createUserDto.uid);
  //     expect(user.email).toEqual(createUserDto.email);
  //     expect(user.username).toEqual(createUserDto.name);
  //     expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);
  //   });
  /**
   * createUserのAbNormal
   *
   *
   */
  // });

  // findUserByUserIdのテスト
  // describe('FindUserByUid', () => {
  //   it('Normal case: creates a new user', async () => {
  //     const user = await service.createUser(createUserDto);

  //     // createUser後のデータを確認
  //     expect(user.uid).toEqual(createUserDto.uid);
  //     expect(user.email).toEqual(createUserDto.email);
  //     expect(user.username).toEqual(createUserDto.name);
  //     expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);
  //   });
  /**
   * createUserのAbNormal
   *
   */
  // });

  // initUserメソッドのテスト
  describe('InitUser', () => {
    it('Normal case: creates a new user with Google auth and get creates todoOrderTable', async () => {
      const user = await service.initUser(createUserDto);

      // initUser後のデータを確認
      expect(user.uid).toEqual(createUserDto.uid);
      expect(user.email).toEqual(createUserDto.email);
      expect(user.username).toEqual(createUserDto.name);
      expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);

      const todoOrders = await prisma.todoOrder.findMany({
        where: { userId: user.id },
      });

      // todoOrderのlengthが3であるか確認
      expect(todoOrders.length).toEqual(3);
      todoOrders.forEach((todoOrder) => {
        expect(todoOrder.todoIds).toBeNull();
      });

      // todoOrderのuserIdが全て同じか確認
      const todoOrdersUserIds = todoOrders.map((todoOrder) => {
        return todoOrder.userId;
      });
      expect(todoOrdersUserIds).toEqual([
        todoOrdersUserIds[0],
        todoOrdersUserIds[0],
        todoOrdersUserIds[0],
      ]);

      // todoOrderのstatusに "TODAY", "TOMORROW", "NEXT" があるか確認
      const todoOrdersStatus = todoOrders.map((todoOrder) => {
        return todoOrder.status;
      });
      expect(todoOrdersStatus).toEqual([
        TodoStatus.TODAY,
        TodoStatus.TOMORROW,
        TodoStatus.NEXT,
      ]);
    });

    // TODO 未実装ためコメントアウト: PrismaClientKnownRequestErrorをinitUserに追加するべき?
    /**
     * if(error instanceof PrismaClientKnownRequestError) {
     *  if(error.code === "P2002") {
     *    throw new ForbiddenException("User already exists.")
     *  }
     * }
     * throw error
     */
    // it('Abnormal case: throws an error if fail to create a new user', async () => {
    //   // すでに同じemailが存在するテストデータ
    //   const createInvalidUserDto = {
    //     email: 'john@example.com',
    //     name: 'Jane Smith',
    //     avatarUrl:
    //       'https://gravatar.com/avatar/ff3bd3d6733b66d9bf8361c8c8b47147?s=400&d=robohash&r=x',
    //     uid: '0e7eaf56-1eed-4dea-b791-2d51efaffc59',
    //   };
    //   try {
    //     await service.initUser(createUserDto);
    //   } catch (error) {
    //     expect(error.status).toBe(403);
    //   }
    // });
  });

  // updateUserメソッドのテスト
  describe('updateUser', () => {
    it('Normal case: Update username', async () => {
      const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
      const paramUserId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
      const userBeforeUpdate = await prisma.user.findUnique({
        where: { id: userId },
      });
      const updatedUser = await service.updateUser(
        userId,
        paramUserId,
        updateUserDto,
      );
      expect(userBeforeUpdate.username).not.toEqual(updatedUser.username);
    });

    it('Abnormal case: throws an error if userId and paramUserId is not equal when update username', async () => {
      const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
      const paramUserId = '62ac362a-cd60-45b1-9100-3b469eceb31d';
      await expect(
        service.updateUser(userId, paramUserId, updateUserDto),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  // deleteUserメソッドのテスト
  describe('deleteUser', () => {
    it('Normal case: delete user', async () => {
      const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';

      await service.deleteUser(userId);
      const user = await service.findUserByUserId(userId);
      expect(user).toBeNull();
    });

    // TODO 未実装ためコメントアウト: userが存在しない場合のエラー処理を追加するべき?
    // it('Abnormal case: throws an error if userId and paramUserId is not equal when update username', async () => {
    //   const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    //   expect(await service.deleteUser(userId)).toBeUndefined();
    // });
  });
});
