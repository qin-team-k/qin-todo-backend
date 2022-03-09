import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';

@Injectable()
export class TodoInterceptor implements NestInterceptor {
  /**
   * context: 入ってくるrequest情報
   * next: responseで出てく時使う(next.handle().pine())
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // console.log(request.query);
    // console.log(request.body);

    const token = request.headers['authorization'].split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    // FIX ME tokenが違っていた場合のエラーハンドリング。現在は500になる。
    if (!decodedToken) throw new ForbiddenException('Access denied');
    request.user = {
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      uid: decodedToken.uid,
    };

    /**
     * 必要な情報のみ返す(UserDto内の@Expose()のみ)
     */

    return next.handle();
  }
}
