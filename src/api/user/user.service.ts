import { ForbiddenException, Injectable } from '@nestjs/common';
import { TodoStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(firebaseUser: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        uid: firebaseUser.uid,
        username: firebaseUser.name,
        email: firebaseUser.email,
        avatarUrl: firebaseUser.picture,
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

  async initUser(firebaseUser: CreateUserDto): Promise<User> {
    return await this.prisma.$transaction(async (prisma): Promise<User> => {
      const user = await prisma.user.create({
        data: {
          uid: firebaseUser.uid,
          username: firebaseUser.name,
          email: firebaseUser.email,
          avatarUrl: firebaseUser.picture,
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

  async updateUsername(userId: string, paramUserId, username: string) {
    if (userId !== paramUserId) {
      throw new ForbiddenException('Access denied');
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { username },
    });
  }

  async updateAvatarUrl(userId: string, avatarUrl: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
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
