import { Controller, Get, Req, Res, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { RefreshTokenGuard } from 'src/common/guards';
import { AuthenticatedGuard } from 'src/common/guards/auth.guard';
import { Tokens } from 'src/types';
import { AccessTokenGuard } from './../../common/guards/access-token.guard';
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
  // @UseGuards(GoogleAuthGuard)
  @UseGuards(AuthGuard('google'))
  login() {
    return;
  }
  /**
   * GET /api/v1/auth/callback
   * OAuthプロバイダーが認証後に呼び出すredirect URL
   */
  @Version('1')
  @Get('callback')
  // @UseGuards(GoogleAuthGuard)
  @UseGuards(AuthGuard('google'))
  async redirect(@Res() res): Promise<Tokens> {
    return res.redirect('http://localhost:8080');
  }

  /**
   * GET /api/v1/auth/profile
   * ユーザー情報を返す
   */
  @Version('1')
  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req) {
    return { ...req.user };
  }

  /**
   * GET /api/v1/auth/logout
   * ログアウト
   */
  @Version('1')
  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  /**
   * GET /api/v1/auth/refresh
   * リフレッシュトークン
   */
  @Version('1')
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
