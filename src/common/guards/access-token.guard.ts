import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * falseを返すとJWTがあっても403を返す
     */

    /**
     * isPublicのメタデータをとる
     * 1. まず最初にハンドラーをチェックする
     * 2. もし何も見つからなかったらクラスをチェックする(AuthController)
     * 3. 結局どこにもisPublicが見つからなかったら false を返す
     * 4. もし何か見つかれば true を返す
     */

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getHandler(),
    ]);

    /**
     * isPublicがあれば true
     * 無ければ Guard発動
     */
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
