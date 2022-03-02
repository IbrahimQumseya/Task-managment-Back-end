import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersRepository } from 'src/auth/users.respository';
import { UserDetailsRepository } from 'src/user-details/user-details.repository';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UsersRepository, UserDetailsRepository]),
  ],
  providers: [ChatService, ChatGateway, UsersService],
})
export class ChatModule {}
