import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GoogleUserDetails } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async validateUser(googleUserDetails: GoogleUserDetails): Promise<User> {
    const { email } = googleUserDetails;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return user;
    return await this.createUser(googleUserDetails);
  }

  async createUser(googleUserDetails: GoogleUserDetails): Promise<User> {
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

  async signin(user: any) {
    const access_token = await this.jwtService.sign(user);
    console.log({ access_token });

    return { access_token };
  }

  async findUser(
    googleUserDetails: GoogleUserDetails,
  ): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: { email: googleUserDetails.email },
    });
  }
}
