import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

import { UpdateUserDetailsDto } from 'src/auth/dto/updateUser-userDetails.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { UsersService } from './users.service';
import * as path from 'path';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { UserDetails } from 'src/user-details/entity/user-details.entity';
import { AdminGuard } from '../gaurds/admin.gaurd';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
      const extensions: string = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extensions}`);
    },
  }),
};

@ApiTags('Users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('users')
export class UsersController {
  logger: Logger = new Logger('users');
  constructor(private userService: UsersService) {}

  @Patch('/user/updateUser')
  @ApiOkResponse({ description: 'Get Task details' })
  @ApiBody({ type: UpdateUserDetailsDto })
  @ApiBearerAuth('access-token')
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<UserDetails> {
    return this.userService.updateUser(user, updateUserDetailsDto);
  }

  @Post('/upload/profile-image')
  @ApiOkResponse({ description: 'Upload user Image' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<User> {
    console.log(file);
    this.logger.verbose(file);
    const imagePath = file.filename;

    const user: User = req.user;
    return this.userService.uploadFile(user.id, imagePath);
  }

  @Get('/user/profile-image')
  @UseGuards(AuthGuard('jwt'))
  getProfileImage(
    @GetUser() user: User,
    @Res() res,
  ): Promise<{ response: any; imageName: string }> {
    return this.userService.getProfileImage(user, res);
  }

  @Patch('/user/set-role/user/:userId/role/:role')
  @ApiOkResponse({ description: 'Update User role ' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiParam({ name: 'role', enum: UserRole, description: 'User Role' })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  @UseGuards(new AdminGuard())
  updateUserRole(
    @Param('userId') userId: string,
    @Param('role') role: UserRole,
  ): Promise<User> {
    return this.userService.updateUserRole(userId, role);
  }

  @Get('/user/roles')
  @ApiOkResponse({ description: 'what roles we have ' })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getRolesForUser(): Promise<object> {
    return this.userService.getRolesForUser();
  }

  @Get()
  @ApiOkResponse({ description: 'getAll users ' })
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(new AdminGuard())
  GetAllUsers(): Promise<User[]> {
    return this.userService.GetAllUsers();
  }
}
