import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../auth/user.entity';
import { UsersRepository } from '../../auth/users.respository';
import { ResetPasswordDto } from '../password-dto/reset-password.dto';

@Injectable()
export class ForgetPasswordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('RESET_PASSWORD_SECRET'),
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    });
  }

  async validate(payload: ResetPasswordDto) {
    const { email } = payload;
    const user: User = await this.userRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
