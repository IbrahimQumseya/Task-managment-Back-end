import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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

  @Patch('/updateUser')
  @ApiOkResponse({ description: 'Update User ' })
  @ApiBody({ type: UpdateUserDetailsDto })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<User> {
    return this.authService.updateUser(user, updateUserDetailsDto);
  }

  @Patch('/user/set-role/user/:userId/role/:role')
  @ApiOkResponse({ description: 'Update User role ' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiParam({ name: 'role', enum: UserRole, description: 'User Role' })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  updateUserRole(
    @Param('userId') userId: string,
    @Param('role') role: UserRole,
  ): Promise<User> {
    return this.authService.updateUserRole(userId, role);
  }

  @Get('/user/roles')
  @ApiOkResponse({ description: 'what roles we have ' })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  getRolesForUser(): Promise<object> {
    return this.authService.getRolesForUser();
  }
}
