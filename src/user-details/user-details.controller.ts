/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateUserDetailsDto } from './Dto/create-user-details-dto';
import { UserDetails } from './entity/user-details.entity';
import { UserDetailsService } from './user-details.service';
@ApiTags('User-Details')
@Controller('user-details')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })

export class UserDetailsController {
  constructor(private userDetailsService: UserDetailsService) {}

  @Get('/getUserDetails')
  @ApiOkResponse({ description: 'Get user details' })
  getUserDetails(@GetUser() user: User): Promise<UserDetails> {
    return this.userDetailsService.getUserDetails(user);
  }
  @Post('/create-details/user/:userId')
  @ApiCreatedResponse({ description: 'Create User Details' })
  @ApiBody({ type: CreateUserDetailsDto })
  createUserDetailsForUser(
    @Param('userId') userId: string,
    @Body() createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    return this.userDetailsService.createUserDetailsForUser(
      userId,
      createUserDetailsDto,
    );
  }
}
