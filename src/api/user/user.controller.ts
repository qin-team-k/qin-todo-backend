import { Controller, Delete, Get, UseGuards, Version } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticateGuard } from 'src/common/guards/authenticate/authenticate.guard';

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
  async users(@GetCurrentUser() user: User): Promise<User> {
    return user;
  }

  /**
   * DELETE /api/v1/users/delete
   * ユーザーを削除する
   */
  @Version('1')
  @Delete('delete')
  async delete(@GetCurrentUser() user: User): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}
