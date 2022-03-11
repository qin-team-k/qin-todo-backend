import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FirebaseUserType } from 'src/types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(firebaseUser: FirebaseUserType): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { uid: firebaseUser.uid },
    });

    if (!user) {
      return await this.initUser(firebaseUser);
    }

    return user;
  }

  async createUser(firebaseUser: FirebaseUserType) {
    return await this.prisma.user.create({
      data: {
        uid: firebaseUser.uid,
        username: firebaseUser.name,
        email: firebaseUser.email,
        avatarUrl: firebaseUser.picture,
      },
    });
  }

  async createTodoOrder(user) {
    return await this.prisma.todoOrder.createMany({
      data: [
        { uuid: user.id, status: 'TODAY' },
        { uuid: user.id, status: 'TOMORROW' },
        { uuid: user.id, status: 'NEXT' },
      ],
    });
  }

  async initUser(firebaseUser: FirebaseUserType) {
    // schema.prismaの generator に previewFeatures = ["interactiveTransactions"] を追加後 npx prisma generate し直す
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
          { uuid: user.id, status: 'TODAY' },
          { uuid: user.id, status: 'TOMORROW' },
          { uuid: user.id, status: 'NEXT' },
        ],
      });
      return user;
    });
  }

  async deleteUser(uuid: string) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.todoOrder.deleteMany({
        where: { uuid },
      });
      await prisma.todo.deleteMany({
        where: { uuid },
      });
      await prisma.user.delete({
        where: { id: uuid },
      });
    });
  }
}
