/* eslint-disable @typescript-eslint/ban-types */
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
import { join } from 'path';
import fs from 'fs';

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
      return 'USER_CREATED';
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUser(idUser: string): Promise<User> {
    const user = this.findOne({ where: { id: idUser } });
    return user;
  }

  async updateOne(userId: string, imagePath: string): Promise<User> {
    try {
      const query = await this.createQueryBuilder()
        .update(User)
        .set({ profileImage: imagePath })
        .where({ id: userId })
        .execute();
      if (query.affected === 1) {
        const user = await this.getUser(userId);
        return user;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getProfileImage(user: User, res: any): Promise<Object> {
    const imageName = user.profileImage;
    const response: any = res.sendFile(
      join(process.cwd(), 'uploads/profileImages/' + imageName),
    );
    return response;
  }
}
