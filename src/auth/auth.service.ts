import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.respository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
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
}
