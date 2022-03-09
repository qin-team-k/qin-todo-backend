import { Controller, Get, UseInterceptors, Version } from '@nestjs/common';
import { GetCurrentUid } from 'src/common/decorators/auth.decorator';
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
  profile(@GetCurrentUid() uid: string) {
    return { uid, name: 'osamu' };
  }
}
