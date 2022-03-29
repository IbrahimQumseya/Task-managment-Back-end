import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.respository';
import { UserDetailsRepository } from 'src/user-details/user-details.repository';
import { FilesService } from 'src/files/files.service';
import { FilesRepository } from 'src/files/files.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UsersRepository,
      UserDetailsRepository,
      FilesRepository,
    ]),
  ],
  providers: [UsersService, FilesService],
  controllers: [UsersController],
})
export class UsersModule {}
