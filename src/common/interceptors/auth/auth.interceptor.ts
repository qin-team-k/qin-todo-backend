import {
  CallHandler,
  ExecutionContext,
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
    const ctx = context.switchToHttp();
    const token = ctx.getRequest().headers['authorization'].split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);

    return next.handle();
  }
}
