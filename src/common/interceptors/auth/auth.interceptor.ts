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
export class AuthInterceptor implements NestInterceptor {
  /**
   * context: 入ってくるrequest情報
   * next: responseで出てく時使う(next.handle().pine())
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'].split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    // FIX ME tokenが違っていた場合のエラーハンドリング。現在は500になる。
    if (!decodedToken) throw new ForbiddenException('Access denied');
    request.uid = decodedToken.uid;

    return next.handle();
  }
}
