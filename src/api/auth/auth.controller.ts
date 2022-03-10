import {
  Controller,
  Delete,
  Get,
  Param,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetFirebaseUser } from 'src/common/decorators';

import { AuthInterceptor } from 'src/common/interceptors/auth/auth.interceptor';
import { FirebaseUserType } from 'src/types';
import { AuthService } from './auth.service';

@Controller('users')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * GET /api/v1/users
   * ユーザー情報を返す
   */

  @Version('1')
  @Get()
  async users(@GetFirebaseUser() user: FirebaseUserType): Promise<User> {
    return await this.authService.validateUser(user);
  }

  /**
   * DELETE /api/v1/users/:uid
   * ユーザーを削除する
   */
  @Version('1')
  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    await this.authService.deleteUser(uid);
  }
}
