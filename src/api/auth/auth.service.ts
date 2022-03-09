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
      const newUser = await this.prisma.user.create({
        data: {
          uid: firebaseUser.uid,
          username: firebaseUser.name,
          email: firebaseUser.email,
          avatarUrl: firebaseUser.picture,
        },
      });
      return newUser;
    }

    return user;
  }
}
