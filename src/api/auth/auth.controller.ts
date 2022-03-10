import { Controller, Get, UseInterceptors, Version } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthInterceptor } from 'src/common/interceptors/auth/auth.interceptor';
import { FirebaseUserType } from 'src/types';
import { AuthService } from './auth.service';

@Controller('users')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * GET /api/v1/auth/profile
   * ユーザー情報を返す
   */

  @Version('1')
  @Get()
  users(@GetCurrentUser() user: FirebaseUserType) {
    return this.authService.validateUser(user);
  }
}
