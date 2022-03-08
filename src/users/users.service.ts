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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
  ) {}

  async getProfileImage(user: User, res: any): Promise<Object> {
    return this.userRepository.getProfileImage(user, res);
  }

  async updateOne(userId: string, imagePath: string): Promise<User> {
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
  ): Promise<User> {
    const userDetails = await this.userDetailsRepository.getUserDetails(user);
    const getUser = await this.userRepository.getUser(user.id);
    const { firstName, lastName, address, location, telephone } =
      updateUserDetailsDto;
    getUser.firstName = firstName;
    getUser.lastName = lastName;

    if (!userDetails) {
      throw new ConflictException('The user Doesnt have details');
    } else {
      userDetails.address = address;
      userDetails.location = location;
      userDetails.telephone = Number(telephone);
      getUser.userDetails = userDetails;
    }
    try {
      await this.userRepository.save(getUser);
      await this.userDetailsRepository.save(userDetails);
      return getUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
