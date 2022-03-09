import { Controller, Get, Req, UseInterceptors, Version } from '@nestjs/common';
import { AuthInterceptor } from 'src/common/interceptors/auth/auth.interceptor';
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
  profile(@Req() req) {
    return { id: '123', name: 'osamu' };
  }
}
