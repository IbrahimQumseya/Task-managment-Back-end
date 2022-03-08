/* eslint-disable @typescript-eslint/ban-types */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.respository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';
import { UpdateUserDetailsDto } from './dto/updateUser-userDetails.dto';
import { UserDetailsRepository } from '../user-details/user-details.repository';
import { User } from './user.entity';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
  ) {}

  async signUp(authCredentialsDto: AuthSignUpCredentialsDto): Promise<string> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDtoL: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDtoL;
    const user = await this.userRepository.findOne({
      username,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check you login credentials');
    }
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
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return this.userRepository.updateUserRole(userId, role);
  }

  async getRolesForUser(): Promise<object> {
    return this.userRepository.getRolesForUser();
  }
}
