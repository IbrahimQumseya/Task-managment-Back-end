import {
  Body,
  Controller,
  Get,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

import { UpdateUserDetailsDto } from 'src/auth/dto/updateUser-userDetails.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { UsersService } from './users.service';
const path = require('path');

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
  constructor(private userService: UsersService) {}

  @Patch('/user/updateUser')
  @ApiOkResponse({ description: 'Get Task details' })
  @ApiBody({ type: UpdateUserDetailsDto })
  @ApiBearerAuth('access-token')
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<User> {
    return this.userService.updateUser(user, updateUserDetailsDto);
  }

  @Post('/upload/profile-image')
  @ApiOkResponse({ description: 'Upload user Image' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Promise<User> {
    const imagePath = file.filename;
    const user: User = req.user;
    return this.userService.updateOne(user.id, imagePath);
  }

  @Get('/user/profile-image')
  @UseGuards(AuthGuard('jwt'))
  getProfileImage(@GetUser() user: User, @Res() res): Promise<Object> {
    return this.userService.getProfileImage(user, res);
  }
}
