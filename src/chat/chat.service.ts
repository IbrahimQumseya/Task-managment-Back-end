import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { UsersRepository } from 'src/auth/users.respository';
import { UserDetailsRepository } from 'src/user-details/user-details.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    console.log(cookie);

    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.usersService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
