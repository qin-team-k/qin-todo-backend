import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Done, GoogleUserDetails } from 'src/utils/types';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: GoogleUserDetails, done: Done) {
    const userDB = await this.authService.findUser(user);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
