import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDetailsDto } from 'src/auth/dto/updateUser-userDetails.dto';
import { User } from 'src/auth/user.entity';
import { UsersRepository } from 'src/auth/users.respository';
import { UserDetailsRepository } from 'src/user-details/user-details.repository';
import * as fs from 'fs';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { UserDetails } from 'src/user-details/entity/user-details.entity';
import { Profile } from 'passport-facebook';
import { LoginOption } from '../auth/enum/user-log-in-enum';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
  ) {}

  async getProfileImage(
    user: User,
    res: any,
  ): Promise<{ response: any; imageName: string }> {
    return this.userRepository.getProfileImage(user, res);
  }

  async uploadFile(userId: string, imagePath: string): Promise<User> {
    const user = await this.userRepository.getUser(userId);

    const getUserProfileImage = user.profileImage && user.profileImage;

    const path = './uploads/profileImages/' + getUserProfileImage;
    if (getUserProfileImage) {
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    return this.userRepository.updateOne(userId, imagePath);
  }
  async updateUser(
    user: User,
    updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<UserDetails> {
    const userDetails = await this.userDetailsRepository.getUserDetails(user);
    const getUser = await this.userRepository.getUser(user.id);
    const { firstName, lastName, address, location, telephone, number } =
      updateUserDetailsDto;
    getUser.firstName = firstName;
    getUser.lastName = lastName;

    if (!userDetails) {
      throw new ConflictException('The user Doesnt have details');
    } else {
      userDetails.address = address;
      userDetails.location = location;
      userDetails.telephone = Number(telephone);
      userDetails.number = Number(number);
      getUser.userDetails = userDetails;
    }
    try {
      await this.userRepository.save(getUser);
      await this.userDetailsRepository.save(userDetails);
      return userDetails;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return this.userRepository.updateUserRole(userId, role);
  }

  async getRolesForUser(): Promise<object> {
    return this.userRepository.getRolesForUser();
  }
}
