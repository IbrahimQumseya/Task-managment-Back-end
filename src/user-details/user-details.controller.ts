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
  ApiParam,
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
  @Post('/createDetails')
  @ApiCreatedResponse({ description: 'Create User Details' })
  @ApiBody({ type: CreateUserDetailsDto })
  createUserDetailsForUser(
    // @Param('id') idUser: string,
    @GetUser() user: User,
    @Body() createUserDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetails> {
    return this.userDetailsService.createUserDetailsForUser(
      user,
      createUserDetailsDto,
    );
  }
}
