import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(userBody: UserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        username: userBody.username,
        email: userBody.email,
        avatarUrl: userBody.avatarUrl,
      },
    });
  }

  async findOne(userId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  deleteUser() {
    return 'delete user';
  }
}
