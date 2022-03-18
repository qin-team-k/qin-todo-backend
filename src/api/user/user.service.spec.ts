import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  // beforeAll(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [UserService, PrismaService, CloudStorageService],
  //   }).compile();

  //   service = module.get<UserService>(UserService);
  // });

  beforeEach(async () => {
    // mockのUserサービスを作成
    const mockUserService: Partial<UserService> = {
      initUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: '24b7282f-9d30-450b-8383-758ec0506b4d',
          uid: createUserDto.uid,
          username: createUserDto.name,
          email: createUserDto.email,
          avatarUrl: createUserDto.avatarUrl,
          createdAt: new Date('2020-06-01T00:00:00.000Z'),
          updatedAt: new Date('2020-06-01T00:00:00.000Z'),
        }),
      // updateUsername: (userId: string, paramUserId: string, username: string) =>
      //   Promise.resolve({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        CloudStorageService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  const createUserDto = {
    email: 'jane@example.com',
    name: 'jane doe',
    avatarUrl:
      'https://gravatar.com/avatar/ff3bd3d6733b66d9bf8361c8c8b47147?s=400&d=robohash&r=x',
    uid: '0e7eaf56-1eed-4dea-b791-2d51efaffc58',
  };

  it('can create an instance of user service', async () => {
    expect(service).toBeDefined();
  });

  // FIXME todoOrderテーブルが作成されかをテストしたい
  it('creates a new user with Google auth and get creates todoOrderTable', async () => {
    const user = await service.initUser(createUserDto);
    // initUser後のデータを確認
    expect(user.uid).toEqual(createUserDto.uid);
    expect(user.email).toEqual(createUserDto.email);
    expect(user.username).toEqual(createUserDto.name);
    expect(user.avatarUrl).toEqual(createUserDto.avatarUrl);
  });
});
