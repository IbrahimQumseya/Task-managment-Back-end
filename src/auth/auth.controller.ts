/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
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
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { http } from 'winston';
import { OAuth2Client } from 'google-auth-library';
import * as passport from 'passport';
import { LogInWithCredentialsGuard } from './3rdauth/guards/logInWithCredentialsGuard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBody({ type: AuthSignUpCredentialsDto })
  signUp(
    @Body() authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }

  // @HttpCode(200)
  // @UseGuards(AuthGuard('local'))
  // @Post('/log-in')
  // async logIn(
  //   @Req() request: Request,
  //   @Body() authCredentialsDto: AuthSignInCredentialsDto,
  // ) {
  //   return request.user;
  // }

  @Post('/signin')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AuthSignInCredentialsDto })
  signIn(
    @Body() authCredentialsDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  //discord
  @Get('/discord')
  @UseGuards(AuthGuard('discord'))
  async getUserFromDiscordLogin(@Req() req): Promise<any> {
    return req.user;
  }

  @Get('/logout')
  async googleAuthLogout(@Req() req: any, res: Response) {
    req.logout();

    return res.redirect('http://localhost:8081/home');
  }

  // @Get('/google')
  // async googleAuthTest(@Req() req) {
  //   return passport.authenticate('google', { scope: ['profile'] });
  // }

  // @Get('/google/callback')
  // async googleAuthTestCallback(@Req() req) {
  //   return passport.authenticate('google', {
  //     successRedirect: 'http://localhost:8081/home',
  //     failureRedirect: '/login/failed',
  //   });
  // }

  // google
  @Post('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthTest(@Req() req, @Body() res: any): Promise<any> {
    return this.authService.googleAuthTest(req, res);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // const googleClient = new OAuth2Client({
    //   clientId: `${process.env.GOOGLE_clientID}`,
    // });
    // console.log(req);

    // const { token } = req.body;
    // const ticket = await googleClient.verifyIdToken({
    //   idToken: token,
    //   audience: `${process.env.GOOGLE_clientID}`,
    // });

    // const payload = ticket.getPayload();
    return await this.authService.googleAuth(req);
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // req.red\

    // const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // const { accessToken } = req.user;

    // const ticket = await googleClient.verifyIdToken({
    //   idToken: accessToken,
    //   audience: `${process.env.GOOGLE_clientID}`,
    // });
    // console.log(ticket);

    // const payload = ticket.getPayload();
    // return await this.authService.googleAuth(payload);
    return this.authService.googleLogin(req, res);
  }

  // facebook
  @Post('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthTest(@Req() req: Request, res: any): Promise<any> {
    return this.authService.facebookAuthRedirect(req);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async getTokenAfterFacebookSignIn(@Req() req) {
    return 'req';
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request): Promise<any> {
    return this.authService.facebookAuthRedirect(req);
  }

  //github
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) { }

  @Get('/github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
