import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 認証後に訪れて良いページにガードを設定する
 * セッションを設定する必要がある。
 * パスポートも初期化しなければいけない。
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const activate = (await super.canActivate(context)) as boolean;
    // console.log({ activate });

    const request = context.switchToHttp().getRequest();
    // console.log({ request });

    await super.logIn(request);
    return activate;
  }
}
