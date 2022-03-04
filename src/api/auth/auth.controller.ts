import {
  Controller,
  Get,
  Res,
  Session,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  AuthenticatedGuard,
  GoogleAuthGuard,
} from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
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
    return;
  }
  /**
   * GET /api/v1/auth/callback
   * OAuthプロバイダーが認証後に呼び出すredirect URL
   */
  @Version('1')
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  redirect(@Session() session, @Res() res) {
    res.redirect('http://localhost:8080');
  }

  /**
   * GET /api/v1/auth/status
   * ユーザーがログインしてるかどうかチェック response 200 or 403
   */
  @Version('1')
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status() {
    return 'ok';
  }

  /**
   * GET /api/v1/auth/logout
   * ログアウト
   */
  @Version('1')
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Session() session, @Res() res) {
    session.destroy(() => {
      res.redirect('http://localhost:8080/login');
    });
  }
}
