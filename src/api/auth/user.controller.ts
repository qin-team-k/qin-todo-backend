import { Controller, Delete, Get, Param, Version } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetFirebaseUser } from 'src/common/decorators';

import { FirebaseUserType } from 'src/types';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /api/v1/users
   * ユーザー情報を返す
   */

  @Version('1')
  @Get()
  async users(@GetFirebaseUser() user: FirebaseUserType): Promise<User> {
    return await this.userService.validateUser(user);
  }

  /**
   * DELETE /api/v1/users/:uid
   * ユーザーを削除する
   */
  @Version('1')
  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    await this.userService.deleteUser(uid);
  }
}
