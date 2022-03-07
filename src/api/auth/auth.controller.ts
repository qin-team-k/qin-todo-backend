import { Controller, Get, Req, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Todo一覧取得
  @Version('1')
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() req) {
    return 'ok';
  }
}
