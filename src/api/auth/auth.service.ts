import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GoogleUserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
    return user;
  }

  async findUser(
    googleUserDetails: GoogleUserDetails,
  ): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { email: googleUserDetails.email },
    });
  }
}
