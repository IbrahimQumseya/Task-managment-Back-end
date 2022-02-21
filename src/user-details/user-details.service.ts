import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { UsersRepository } from 'src/auth/users.respository';
import { CreateUserDetailsDto } from './Dto/create-user-details-dto';
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
    user: User,
    createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    // const user = await this.usersRepository.getUser(idUser);

    return await this.userDetailsRepository.createUserDetailsForUser(
      user,
      createUserDetailsDto,
    );
  }
}
