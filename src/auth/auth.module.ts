import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.respository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { UserDetailsRepository } from '../user-details/user-details.repository';
import { UserDetails } from '../user-details/entity/user-details.entity';
import { DiscordStrategy } from './3rdauth/Discord/discord.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './3rdauth/google/google.strategy';
import { HttpModule } from '@nestjs/axios';
import { FacebookStrategy } from './3rdauth/facebook/facebook.strategy';
import { GithubStrategy } from './3rdauth/github/github.strategy';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRECT'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UsersRepository,
      UserDetailsRepository,
      UserDetails,
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    DiscordStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
