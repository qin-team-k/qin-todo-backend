import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'].split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        uid: decodedToken.uid,
      };
    } catch (error) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
