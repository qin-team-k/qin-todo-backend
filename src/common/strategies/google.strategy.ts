import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/api/auth/auth.service';

/**
 * この関数は基本的に内部で呼び出され処理される。
 * AuthModuleのprovidersに登録するだけでOK!!
 * superはPassportStrategy内のconstructorを実行するために必要。
 * PassportStrategyはvalidateメソッドを持っている
 * Passportは...
 * 1. 認証のステップ（ログインなど）を実行する必要がある
 * 2. その後ユーザーの資格情報を確認する必要がある(ユーザーのセッションが有効かどうか)
 * どうやってこれを呼び出すのか? AuthGardにあるloginメソッドを利用する
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * 絶対にないとダメ！
   * もしないとUseGuard()使ったときに「ないですよ」と怒られる
   * validateの括弧内はgoogleが返してくれるユーザー情報
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, photos } = profile;
    const googleUserDetails = {
      id,
      email: emails[0].value,
      username: profile.displayName,
      avatarUrl: photos[0].value,
    };

    await this.authService.validateUser(googleUserDetails);
    const user = await this.authService.findUser(googleUserDetails.email);
    // nullは成功の意味、userをrequestへ渡す(request.user)
    done(null, user);
  }
}
