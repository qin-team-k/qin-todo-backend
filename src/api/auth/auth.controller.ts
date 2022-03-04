import { Controller, Get, Req, UseGuards, Version } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  AuthenticatedGuard,
  GoogleAuthGuard,
} from 'src/common/guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * GET /api/v1/auth/login
   * username passwordで登録する場合はPOSTだけどOAuthの場合は違う
   * ユーザーが認証でくるところ。OAuthプロバイダーにリダイレクトする。
   * その後認証の確認ボタンを押す。どうやって押したことを知るのか？
   * OAuthプロバイダーはこちら側の redirect URL を呼び出す。(コールバック)
   */
  @Version('1')
  @Get('login')
  @UseGuards(GoogleAuthGuard)
  login() {
    return 'login';
  }
  /**
   * GET /api/v1/auth/callback
   * OAuthプロバイダーが認証後に呼び出すredirect URL
   */
  @Version('1')
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  redirect(@Req() req): Promise<User> {
    return this.authService.findUser(req.user);
  }

  /**
   * GET /api/v1/auth/status
   * ユーザーがログインしてるかどうかチェック response 200 or 401
   */
  @Version('1')
  @UseGuards(AuthenticatedGuard)
  @Get('status')
  status() {
    return 'ok';
  }

  /**
   * GET /api/v1/auth/logout
   * ログアウト
   */
  @Version('1')
  @Get('logout')
  logout() {
    return 'logout';
  }
}
