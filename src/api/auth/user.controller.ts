import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Version,
} from '@nestjs/common';
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
  async users() {
    return 'users';
  }

  /**
   * DELETE /api/v1/users/:uid
   * ユーザーを削除する
   */
  @Version('1')
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.userService.deleteUser(uuid);
  }
}
