import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { UpdateUserDetailsDto } from './dto/updateUser-userDetails.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

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

  // @Patch('/:id')
  // updateUser(
  //   @Param('id') idUser: string,
  //   @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  // ): Promise<User> {
  //   return this.authService.updateUser(idUser, updateUserDetailsDto);
  // }
  @UseGuards(AuthGuard())
  @Patch('/updateUser')
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<User> {
    return this.authService.updateUser(user, updateUserDetailsDto);
  }
}
