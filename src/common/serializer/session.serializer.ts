import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GoogleUserDetails } from 'src/types';

import { AuthService } from '../../api/auth/auth.service';

/**
 * パスポートはセッションにユーザー情報と認証状態を乗っける
 * そのユーザー情報はserializeUser()を呼び出すと取得できる
 * strategy内のvalidate()メソッドでdone(null,user)から渡されてくる
 * 最初は複雑に感じるが、高度なシナリオではデータベースやキャッシュからさらなる情報を追加できる
 * 通常は定型文をしようするだけでよい。
 * ここでユーザーデータを変えるのか?ストラテジーで変えるべきか?
 */

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(
    user: GoogleUserDetails,
    done: (err: Error, user: User) => void,
  ) {
    const userDB = await this.authService.findUser(user);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
