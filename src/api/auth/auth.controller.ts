import {
  Controller,
  Get,
  Req,
  Res,
  Session,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from 'src/common/guards/auth.guard';
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
  redirect(@Req() req) {
    console.log({ user: req.user });

    return this.authService.signin(req.user);
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
  @UseGuards(AuthenticatedGuard)
  logout(@Session() session, @Res() res) {
    session.destroy(() => {
      res.redirect('http://localhost:8080/login');
    });
  }
}
