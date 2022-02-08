import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignUpCredentialsDto } from './dto/signup-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(
    @Body() authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
