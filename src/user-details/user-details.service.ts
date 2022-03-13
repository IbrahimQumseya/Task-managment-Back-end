/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.respository';
import { CreateUserDetailsDto } from './dto/create-user-details-dto';
import { UserDetails } from './entity/user-details.entity';
import { UserDetailsRepository } from './user-details.repository';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async getUserDetails(user: User): Promise<UserDetails> {
    return await this.userDetailsRepository.getUserDetails(user);
  }

  async createUserDetailsForUser(
    userId: string,
    createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    return await this.userDetailsRepository.createUserDetailsForUser(
      userId,
      createUserDetailsDto,
    );
  }
}
