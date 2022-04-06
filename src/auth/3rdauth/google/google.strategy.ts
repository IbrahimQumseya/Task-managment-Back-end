import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../../auth.service';
import { LoginOption } from '../../enum/user-log-in-enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_clientID'),
      clientSecret: configService.get('GOOGLE_clientSecret'),
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      // callbackURL: 'http://localhost:8081/',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.authService.findOrCreate(
      profile,
      LoginOption.GOOGLE,
    );
    console.log(accessToken);

    return done(null, user);
  }
}
