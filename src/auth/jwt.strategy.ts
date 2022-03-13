/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { logger } from 'src/logger/logger.winston';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.respository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRECT'),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.userRepository.findOne({
      username,
      isDeactivated: false,
    });
    if (!user) {
      logger.error(
        'error',
        `Unauthorized with username Of ${username} , Failed!`,
      );
      throw new UnauthorizedException();
    }
    logger.log('verbose', `Success with username Of ${username} , Success!`);
    return user;
  }
}
