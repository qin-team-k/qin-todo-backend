import { Controller, Delete, Get, UseGuards, Version } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser, GetCurrentUuid } from 'src/common/decorators';
import { AuthenticateGuard } from 'src/common/guards/authenticate';

import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthenticateGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /api/v1/users
   * ユーザー情報を返す
   */

  @Version('1')
  @Get()
  async users(@GetCurrentUser() user: User) {
    return user;
  }

  /**
   * DELETE /api/v1/users/delete
   * ユーザーを削除する
   */
  @Version('1')
  @Delete('delete')
  async delete(@GetCurrentUuid() uuid: string) {
    await this.userService.deleteUser(uuid);
  }
}
