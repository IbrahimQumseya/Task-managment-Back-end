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
      return details;
    } catch (error) {
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
      telephone,
      number,
      user: { id: idUser },
    });
    try {
      await this.save(userDetails);
      return userDetails;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User Details already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
