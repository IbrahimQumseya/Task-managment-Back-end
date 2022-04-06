import {
  ConflictException,
  HttpStatus,
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
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { LoginOption } from './enum/user-log-in-enum';
import { Profile } from 'passport-facebook';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRepository(UserDetailsRepository)
    private userDetailsRepository: UserDetailsRepository,
  ) {}

  async googleAuth(payload: any) {
    const user = await this.userRepository.findOne({ email: payload?.email });
    if (user) {
      return user;
    }
    try {
      const createdUser = await this.userRepository.create({
        email: payload?.email,
        firstName: payload?.name,
        lastName: payload?.name,
        password: null,
        username: payload?.email,
        signWith: LoginOption.GOOGLE,
      });
      this.userRepository.save(createdUser);
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOrCreate(
    profile: Profile,
    signWith: LoginOption,
  ): Promise<{ accessToken: string }> {
    // const findUser = profile.emails[0].value;
    const findUser = profile.username
      ? profile.username
      : profile.name.givenName + profile.id;
    const user = await this.userRepository.findOne({ username: findUser });
    if (user) {
      return this.signIn({ username: findUser, password: null });
    }

    const createUser = await this.userRepository.create3rdAuthUser({
      id: uuid(),
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      username: profile.username
        ? profile.username
        : profile.name.givenName + profile.id,
      signWith,
    });
    return this.signIn({
      username: createUser.username,
      password: null,
    });
  }

  async googleAuthTest(req: Request, res): Promise<any> {
    if (!req.user) {
      return 'No User from google';
    }
    console.log(res);

    return res;
  }

  async facebookAuthTest(req: Request, res): Promise<any> {
    if (!req.user) {
      return 'No User from facebook';
    }

    return res;
  }

  async googleLogin(req: any): Promise<any> {
    if (!req.user) {
      return 'No User from google';
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User information from google',
      accessToken: req.user.accessToken,
    };
  }

  async facebookAuthRedirect(req: any): Promise<any> {
    if (!req.user) {
      return 'No User from FACEBOOK';
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User information from FACEBOOK',
      accessToken: req.user.accessToken,
    };
  }

  async signUp(authCredentialsDto: AuthSignUpCredentialsDto): Promise<string> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDtoL: AuthSignInCredentialsDto): Promise<{
    accessToken: string;
  }> {
    const { username, password } = authCredentialsDtoL;
    const user = await this.userRepository.findOne({
      username,
    });
    if (
      user &&
      user.signWith === LoginOption.LOCAL &&
      (await bcrypt.compare(password, user.password))
    ) {
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
    } else if (user && user.signWith !== LoginOption.LOCAL) {
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
        `Signing in ${user?.username} "Please check you login credentials"  , Failed!`,
      );
      throw new UnauthorizedException('Please check you login credentials');
    }
  }

  async findUserFromDiscordId(discordId: string): Promise<any> {
    const user = await this.userRepository.getUser(discordId);
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
