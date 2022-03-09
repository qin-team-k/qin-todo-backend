import { Controller, Get, UseInterceptors, Version } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/auth.decorator';
import { AuthInterceptor } from 'src/common/interceptors/auth/auth.interceptor';
import { FirebaseUserType } from 'src/types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * GET /api/v1/auth/profile
   * ユーザー情報を返す
   */
  @UseInterceptors(AuthInterceptor)
  @Version('1')
  @Get('profile')
  profile(@GetCurrentUser() user: FirebaseUserType) {
    return this.authService.validateUser(user);
  }
}
