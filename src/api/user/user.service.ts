import { Injectable } from '@nestjs/common';
import { TodoStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        uid: createUserDto.uid,
        username: createUserDto.name,
        email: createUserDto.email,
        avatarUrl: createUserDto.avatarUrl,
      },
    });
  }

  async findUserByUid(uid: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { uid },
    });
  }

  async createTodoOrder(user): Promise<void> {
    await this.prisma.todoOrder.createMany({
      data: [
        { userId: user.id, status: TodoStatus.TODAY },
        { userId: user.id, status: TodoStatus.TOMORROW },
        { userId: user.id, status: TodoStatus.NEXT },
      ],
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

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.todoOrder.deleteMany({
        where: { userId },
      });
      await prisma.todo.deleteMany({
        where: { userId },
      });
      await prisma.user.delete({
        where: { id: userId },
      });
    });
  }
}
