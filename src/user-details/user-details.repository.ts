/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDetailsDto } from './dto/create-user-details-dto';
import { UserDetails } from './entity/user-details.entity';
import { v4 as uuid } from 'uuid';
import LoggerService from '../utils/logger';

@EntityRepository(UserDetails)
export class UserDetailsRepository extends Repository<UserDetails> {
  private logger = new LoggerService();
  async getUserDetails(user: User): Promise<UserDetails> {
    const query = this.createQueryBuilder('userDetails');
    const { id } = user;
    try {
      const details = await query
        .andWhere('userDetails.userId = :id', {
          id,
        })
        .getOne();
      this.logger.logger.log({
        level: 'info',
        message: `getting user Details of username of ${user.username}   , Success!`,
      });
      return details;
    } catch (error) {
      this.logger.logger.log({
        level: 'error',
        message: `getting user Details of username of ${user.username} "${error}"   , FailED!`,
      });
      throw new NotFoundException();
    }
  }

  async createUserDetailsForUser(
    idUser: string,
    createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    const { address, location, number, telephone } = createUserDetailsDto;
    const userDetails = this.create({
      address,
      location,
      telephone: Number(telephone),
      number: Number(number),
      user: { id: idUser },
    });
    try {
      await this.save(userDetails);
      this.logger.logger.log({
        level: 'info',
        message: `Create user Details of user of  ID ${idUser}   , Success!`,
      });
      return userDetails;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.logger.log({
          level: 'error',
          message: `Create user Details of user of  ID ${idUser} "error : ""User Details already exists""   , Failed!`,
        });
        throw new ConflictException('User Details already exists');
      } else {
        this.logger.logger.log({
          level: 'error',
          message: `Create user Details of user of  ID ${idUser} "error : ""${error}""   , Failed!`,
        });
        throw new InternalServerErrorException();
      }
    }
  }
}
