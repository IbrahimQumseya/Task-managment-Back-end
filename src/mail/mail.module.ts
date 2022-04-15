import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../auth/users.respository';
import { UserDetailsRepository } from '../user-details/user-details.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForgetPasswordStrategy } from './token-service/ForgetPassword.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'Reset-password' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('RESET_PASSWORD_SECRET'),
        signOptions: {
          expiresIn: '30m',
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersRepository, UserDetailsRepository]),
  ],
  providers: [MailService, UsersService, ForgetPasswordStrategy],
  controllers: [MailController],
  exports: [ForgetPasswordStrategy, PassportModule],
})
export class MailModule {}
