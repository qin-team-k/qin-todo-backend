import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FirebaseUserType } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(firebaseUser: FirebaseUserType): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { uid: firebaseUser.uid },
    });

    if (!user) {
      const newUser = await this.createNewUser(firebaseUser);
      return newUser;
    }

    return user;
  }

  async createNewUser(firebaseUser: FirebaseUserType) {
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
          { userId: user.id, status: 'TODAY' },
          { userId: user.id, status: 'TOMORROW' },
          { userId: user.id, status: 'NEXT' },
        ],
      });
      return user;
    });
  }
}
