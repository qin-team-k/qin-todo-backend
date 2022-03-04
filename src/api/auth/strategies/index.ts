import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

/**
 * この関数は基本的に内部で呼び出され処理される。
 * どうやってこれを呼び出すのか? ここでAuthGardを利用する。
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, emails, photos, _json, provider } = profile;
    const details = {
      id,
      email: emails[0].value,
      username: _json.name,
      avatarUrl: photos[0].value,
      provider,
      accessToken,
    };
    await this.authService.validateUser(details);
  }
}
