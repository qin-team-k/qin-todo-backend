import { Controller, Get, Version } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  /**
   * GET /api/v1/auth/login
   * username passwordで登録する場合はPOSTだけどOAuthの場合は違う
   * ユーザーが認証でくるところ。OAuthプロバイダーにリダイレクトする。
   * その後認証の確認ボタンを押す。どうやって押したことを知るのか？
   * OAuthプロバイダーはこちら側の redirect URL を呼び出す。(コールバック)
   * @returns
   */
  @Version('1')
  @Get('login')
  login() {
    return 'login';
  }
  /**
   * GET /api/v1/auth/redirect
   * OAuthプロバイダーが認証後に呼び出すredirect URL
   * @returns
   */
  @Version('1')
  @Get('redirect')
  redirect() {
    return 'redirect';
  }

  /**
   * GET /api/v1/auth/status
   * ユーザーがログインしてるかどうかチェック response 200 or 401
   * @returns
   */
  @Version('1')
  @Get('status')
  status() {
    return 'redirect';
  }

  /**
   * GET /api/v1/auth/logout
   * ログアウト
   * @returns
   */
  @Version('1')
  @Get('logout')
  logout() {
    return 'logout';
  }
}
