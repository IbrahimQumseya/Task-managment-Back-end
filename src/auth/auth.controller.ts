/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { v4 as uuid } from 'uuid';
import {
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';

import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { UpdateUserDetailsDto } from './dto/updateUser-userDetails.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserRoleDto } from './dto/UpdateUserRole.dto';
import { UserRole } from './enum/user-role.enum';
@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBody({ type: AuthSignUpCredentialsDto })
  signUp(
    @Body() authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AuthSignInCredentialsDto })
  signIn(
    @Body() authCredentialsDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
