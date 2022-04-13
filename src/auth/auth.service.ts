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
import { logger } from 'src/logger/logger.winston';
import { UserRole } from './enum/user-role.enum';
import { StripeService } from '../stripe/stripe.service';
import { BrainService } from '../brain/brain.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
    private stripeService: StripeService,
    private brainTreeCustomer: BrainService,
  ) {}

  async signUp(authCredentialsDto: AuthSignUpCredentialsDto): Promise<string> {
    const brainTreeCustomer = await this.brainTreeCustomer.createCustomer(
      authCredentialsDto.username,
      authCredentialsDto.email,
    );
    const stripeCustomer = await this.stripeService.createCustomer(
      authCredentialsDto.username,
      authCredentialsDto.email,
    );
    return this.userRepository.createUser(
      authCredentialsDto,
      stripeCustomer,
      brainTreeCustomer,
    );
  }

  async signIn(authCredentialsDtoL: AuthSignInCredentialsDto): Promise<{
    accessToken: string;
  }> {
    const { username, password } = authCredentialsDtoL;
    const user = await this.userRepository.findOne({
      username,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const {
        firstName,
        lastName,
        email,
        isDeactivated,
        role,
        profileImage,
        id,
      } = user;
      const payload: JwtPayload = {
        username,
        user: {
          id,
          firstName,
          lastName,
          email,
          role,
          profileImage,
          isDeactivated,
        },
      };
      const accessToken: string = await this.jwtService.sign(payload);
      logger.log('verbose', `Signing in ${user.username} , Success!`);
      return { accessToken };
    } else {
      logger.log(
        'error',
        `Signing in ${user.username} "Please check you login credentials"  , Failed!`,
      );
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
      logger.log(
        'error',
        `The user Doesn't have details ${getUser.username} , Success!`,
      );
      throw new ConflictException(`The user Doesn't have details`);
    } else {
      userDetails.address = address;
      userDetails.location = location;
      userDetails.telephone = Number(telephone);
      getUser.userDetails = userDetails;
    }
    try {
      await this.userRepository.save(getUser);
      await this.userDetailsRepository.save(userDetails);
      logger.log(
        'verbose',
        `Updating a Username details with username of ${getUser.username} , Success!`,
      );
      return getUser;
    } catch (error) {
      logger.log(
        'error',
        `Updating a Username details with username of ${getUser.username} , Failed!`,
      );
      throw new InternalServerErrorException();
    }
  }
}
