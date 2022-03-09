import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(googleUserDetails): Promise<User> {
    const { email } = googleUserDetails;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return user;

    return await this.createUser(googleUserDetails);
  }

  async createUser(googleUserDetails): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username: googleUserDetails.username,
        email: googleUserDetails.email,
        avatarUrl: googleUserDetails.avatarUrl,
      },
    });
    await this.prisma.todoOrder.createMany({
      data: [
        { userId: user.id, status: 'TODAY' },
        { userId: user.id, status: 'TOMORROW' },
        { userId: user.id, status: 'NEXT' },
      ],
    });
    return user;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
