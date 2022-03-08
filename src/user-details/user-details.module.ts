import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserDetails } from './entity/user-details.entity';
import { User } from '../auth/user.entity';
import { UserDetailsRepository } from './user-details.repository';
import { UsersRepository } from '../auth/users.respository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserDetails,
      User,
      UserDetailsRepository,
      UsersRepository,
    ]),
  ],
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
})
export class UserDetailsModule {}
