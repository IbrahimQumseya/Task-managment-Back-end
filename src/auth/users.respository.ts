/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { logger } from 'src/logger/logger.winston';

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
      logger.log(
        'verbose',
        `Signing up a user with name of ${user.username} , Success!`,
      );
      return 'USER_CREATED';
    } catch (error) {
      if (error.code === '23505') {
        logger.log(
          'error',
          `user already exist with username of : ${user.username} , Failed!`,
        );
        throw new ConflictException('Username already exists');
      } else {
        logger.log(
          'error',
          `Internal Server Error check user entities ${user.username} , FAILED!`,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async getUser(idUser: string): Promise<User> {
    const user = this.findOne({ where: { id: idUser } });
    if (!user) {
      logger.log('error', `User with id of ${idUser} Not Found , Failed!`);
      throw new NotFoundException(`User with id of ${idUser} Not Found`);
    }
    return user;
  }
}
