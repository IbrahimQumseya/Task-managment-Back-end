/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDetailsDto } from './Dto/create-user-details-dto';
import { UserDetails } from './entity/user-details.entity';
import { v4 as uuid } from 'uuid';
import { UpdateUserDetailsDto } from 'src/auth/dto/updateUser-userDetails.dto';
import { logger } from 'src/logger/logger.winston';

@EntityRepository(UserDetails)
export class UserDetailsRepository extends Repository<UserDetails> {
  async getUserDetails(user: User): Promise<UserDetails> {
    const query = this.createQueryBuilder('userDetails');
    const { id } = user;
    try {
      const details = await query
        .andWhere('userDetails.userId = :id', {
          id,
        })
        .getOne();
      logger.log(
        'verbose',
        `getting user Details of username of ${user.username}   , Success!`,
      );
      return details;
    } catch (error) {
      logger.log(
        'error',
        `getting user Details of username of ${user.username} "${error}"   , FailED!`,
      );
      throw new NotFoundException();
    }
  }

  async createUserDetailsForUser(
    userId: string,
    createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    const { address, location, number, telephone } = createUserDetailsDto;
    const userDetails = this.create({
      address,
      location,
      telephone,
      number,
      user: { id: userId },
    });
    try {
      await this.save(userDetails);
      logger.log(
        'verbose',
        `Create user Details of user of  ID ${userId}   , Success!`,
      );
      return userDetails;
    } catch (error) {
      if (error.code === '23505') {
        logger.error(
          'error',
          `Create user Details of user of  ID ${userId} "error : ""User Details already exists""   , Failed!`,
        );
        throw new ConflictException('User Details already exists');
      } else {
        logger.error(
          'error',
          `Create user Details of user of  ID ${userId} "error : ""${error}""   , Failed!`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
}
