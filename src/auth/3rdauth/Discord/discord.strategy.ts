import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { stringify } from 'querystring';
import { AuthService } from 'src/auth/auth.service';
import { HttpService } from '@nestjs/axios';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private http: HttpService,
    private configService: ConfigService,
  ) {
    super({
      // 'https://discord.com/api/oauth2/authorize?client_id=958690382072397824&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord&response_type=code&scope=identify',

      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: configService.get('clientID'),
          redirect_uri: configService.get('DISCORD_callbackURL'),
          response_type: 'code',
          scope: 'identify',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID: configService.get('DISCORD_clientID'),
      clientSecret: configService.get('DISCORD_clientSecret'),
      callbackURL: configService.get('DISCORD_callbackURL'),
    });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    return this.authService.findUserFromDiscordId(data.id);
  }
}

// authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
//   {
//     client_id: configService.get('clientID'),
//     redirect_uri: configService.get('callbackURL'),
//     response_type: 'code',
//     scope: 'identify',
//   })}

// authorizationURL:
//         'https://discord.com/api/oauth2/authorize?client_id=958690382072397824&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord&response_type=code&scope=identify',
