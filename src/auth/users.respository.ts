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
import { UserRole } from './enum/user-role.enum';
import { join } from 'path';
import PublicFile from 'src/files/entity/PublicFile.entity';
import LoggerService from '../utils/logger';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new LoggerService();
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
      this.logger.logger.log({
        level: 'info',
        message: `Signing up a user with name of ${user.username} , Success!`,
      });
      return 'USER_CREATED';
    } catch (error) {
      if (error.code === '23505') {
        this.logger.logger.log({
          level: 'error',
          message: `user already exist with username of : ${user.username} , Failed!`,
        });
        throw new ConflictException('Username already exists');
      } else {
        this.logger.logger.log({
          level: 'error',
          message: `Internal Server Error check user entities ${user.username} , FAILED!`,
        });
        throw new InternalServerErrorException();
      }
    }
  }

  async getUser(idUser: string): Promise<User> {
    const user = this.findOne({ where: { id: idUser } });
    if (!user) {
      this.logger.logger.log({
        level: 'error',
        message: `User with id of ${idUser} Not Found , Failed!`,
      });
      throw new NotFoundException(`User with id of ${idUser} Not Found`);
    }
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
      role: key.toLowerCase(),
      // Role: UserRole[key].toLowerCase(),
    }));
    return roleForUsers;
  }

  async updateOne(
    userId: string,
    imagePath: string,
    avatar?: PublicFile,
  ): Promise<User> {
    try {
      if (avatar) {
        const query = await this.createQueryBuilder()
          .update(User)
          .set({ profileImage: imagePath, avatar })
          .where({ id: userId })
          .execute();
        if (query.affected === 1) {
          const user = await this.getUser(userId);
          return user;
        } else {
          throw new NotFoundException();
        }
      } else {
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
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getProfileImage(
    user: User,
    res: any,
  ): Promise<{ response: any; imageName: string }> {
    const imageNameUser = user.profileImage;
    const response: any = res.sendFile(
      join(process.cwd(), 'uploads/profileImages/' + imageNameUser),
    );
    return { response, imageName: 'uploads/profileImages/' + imageNameUser };
  }
}
