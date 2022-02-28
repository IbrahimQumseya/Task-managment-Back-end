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
import { UserRole } from './enum/user-role.enum';

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

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const query = this.createQueryBuilder();
    const toUpperCase: string = role.toUpperCase();
    const getRole: UserRole = UserRole[toUpperCase];
    try {
      // const updated = await this.update(userId, { role: getRole });
      const res = await query
        .update(User)
        .set({ role: getRole })
        .where('id =:userId', { userId })
        .execute();

      if (res.affected === 1) {
        const user = this.getUser(userId);
        return user;
      } else {
        throw new NotFoundException(`The user doesn't exist`);
      }
    } catch (error) {
      throw new ConflictException('check the enum input');
    }
  }

  async getRolesForUser(): Promise<object> {
    const roleForUsers = Object.keys(UserRole).map((key) => ({
      Name: key,
      Role: UserRole[key],
    }));
    return roleForUsers;
  }
}
