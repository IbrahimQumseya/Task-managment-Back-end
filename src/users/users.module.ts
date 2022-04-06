import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.respository';
import { UserDetailsRepository } from 'src/user-details/user-details.repository';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UsersRepository, UserDetailsRepository]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
