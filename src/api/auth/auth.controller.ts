import { Controller, Get, Version } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * GET /api/v1/auth/profile
   * ユーザー情報を返す
   */
  @Version('1')
  @Get('profile')
  profile() {
    return 'profile';
  }
}
