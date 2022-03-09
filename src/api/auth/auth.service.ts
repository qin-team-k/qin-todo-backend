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

    return user;
  }
}
