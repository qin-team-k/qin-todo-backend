import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(userBody: UserDto): Promise<User> {
    const url =
      'https://gravatar.com/avatar/4eb616d78c7f80ce3924e825a55e6b73?s=400&d=robohash&r=x';
    return this.prisma.user.create({
      data: {
        username: userBody.username,
        email: userBody.email,
        avatarUrl: userBody.avatarUrl,
      },
    });
  }

  getUser() {
    return 'get user';
  }

  deleteUser() {
    return 'delete user';
  }
}
