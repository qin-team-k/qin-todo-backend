import { parse } from 'path';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TodoStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async findUserByUid(uid: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { uid },
    });
  }

  // FIXME 初回ログイン時にもストレージにファイルの保存する
  async initUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.$transaction(async (prisma): Promise<User> => {
      const user = await prisma.user.create({
        data: {
          uid: createUserDto.uid,
          username: createUserDto.name,
          email: createUserDto.email,
          avatarUrl: createUserDto.avatarUrl,
        },
      });
      await prisma.todoOrder.createMany({
        data: [
          { userId: user.id, status: TodoStatus.TODAY },
          { userId: user.id, status: TodoStatus.TOMORROW },
          { userId: user.id, status: TodoStatus.NEXT },
        ],
      });
      return user;
    });
  }

  async updateUser(
    userId: string,
    paramUserId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userId !== paramUserId) {
      throw new ForbiddenException(
        'Access denied: The userId obtained during authentication and the param userId provided are different values.',
      );
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { username: updateUserDto.username },
    });
  }

  async uploadAvatarImage(
    userId: string,
    paramUserId: string,
    avatarImage: Express.Multer.File,
  ): Promise<User> {
    if (userId !== paramUserId) {
      throw new ForbiddenException(
        'Access denied: The userId obtained during authentication and the param userId provided are different values.',
      );
    }
    // ファイルのアップロード先パス名
    const fileExtension = parse(avatarImage.originalname).ext;
    const newFilename = `${userId}/${Date.now()}${fileExtension}`;
    const filePath = `avatar/${newFilename}`;

    const avatarUrl = await this.cloudStorageService.uploadImage(
      avatarImage,
      filePath,
    );
    return await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
