import { Controller, Get, Req, Res, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { RefreshTokenGuard } from 'src/common/guards';
import { JwtPayload } from 'src/types';
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
  @Public()
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
  @Public()
  @UseGuards(AuthGuard('google'))
  async redirect(@Req() req, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.issueTokens(req.user.id);
    console.log(tokens);

    res.cookie('quin-todo-access-token', tokens.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'strict',
    });
    res.cookie('quin-todo-refresh-token', tokens.refresh_token, {
      maxAge: 60000,
      httpOnly: true,
    });
    return { msg: 'success' };
  }

  /**
   * GET /api/v1/auth/profile
   * ユーザー情報を返す
   */
  @Version('1')
  @Get('profile')
  status(@GetCurrentUser() user: JwtPayload) {
    return this.authService.findUser(user.email);
  }

  /**
   * GET /api/v1/auth/logout
   * ログアウト
   */
  @Version('1')
  @Get('logout')
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  /**
   * GET /api/v1/auth/refresh
   * リフレッシュトークン
   * クッキーに「/refresh」パスを追加して、ここへのリクエストだけにクッキーが送信されるようにする必要がある
   */
  @Version('1')
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res,
  ) {
    const refreshedTokens = await this.authService.refreshToken(
      userId,
      refreshToken,
    );

    res.cookie('quin-todo-access-token', refreshedTokens.access_token, {
      maxAge: 60000,
      httpOnly: true,
    });
    res.cookie('quin-todo-refresh-token', refreshedTokens.refresh_token, {
      maxAge: 60000,
      httpOnly: true,
    });
    return { msg: 'success' };
  }
}
