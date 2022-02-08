/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<string> {
    const { username, password, email, firstName, lastName } =
      authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
    });
    try {
      await this.save(user);
      return "USER_CREATED"
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
