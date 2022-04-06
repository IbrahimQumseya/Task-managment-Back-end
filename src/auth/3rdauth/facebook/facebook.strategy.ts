import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { UsersService } from '../../../users/users.service';
import { AuthService } from '../../auth.service';
import { LoginOption } from '../../enum/user-log-in-enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_clientID'),
      clientSecret: configService.get('FACEBOOK_clientSecret'),
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      // callbackURL: 'http://localhost:8081/',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    // const { name, emails, username } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   username,
    // };
    // const payload = {
    //   user,
    //   accessToken,
    // };
    const user = await this.authService.findOrCreate(
      profile,
      LoginOption.FACEBOOK,
    );

    return done(null, user);
  }
}
