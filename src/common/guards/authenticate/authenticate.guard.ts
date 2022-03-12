import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'].split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const firebaseUser = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        uid: decodedToken.uid,
      };

      const user = await this.userService.findUserByUid(decodedToken.uid);

      if (!user) {
        const newUser = await this.userService.initUser(firebaseUser);
        request['user'] = newUser;
      } else {
        request['user'] = user;
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Access denied');
    }
  }
}
