import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private user: UserService) {}

  @Version('1')
  @Post()
  create(@Body() userBody: UserDto) {
    return this.user.create(userBody);
  }

  @Version('1')
  @Get()
  findOne(): Promise<User> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.user.findOne(userId);
  }
}
