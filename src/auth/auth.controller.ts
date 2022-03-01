/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
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
import { AuthService } from './auth.service';
import { v4 as uuid } from 'uuid';
import {
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';
import { UpdateUserDetailsDto } from './dto/updateUser-userDetails.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { Observable, of } from 'rxjs';
import { join } from 'path';

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
  @ApiOkResponse({ description: 'Get Task details' })
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

  @Post('/upload')
  @ApiOkResponse({ description: 'Upload user Image' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Promise<User> {
    const imagePath = file.filename;
    const user: User = req.user;
    console.log(user);
    return this.authService.updateOne(user.id, imagePath);
  }

  @Get('/profile-image/:imageName')
  @UseGuards(AuthGuard('jwt'))
  getProfileImage(
    @Param('imageName') imageName: string,
    @Res() res,
  ): Promise<Object> {
    
    return this.authService.getProfileImage(imageName, res);
  }
}
