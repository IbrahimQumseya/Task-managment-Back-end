/* eslint-disable prettier/prettier */
import {
  IsEmail,
  isString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable prettier/prettier */
export class AuthSignInCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'password' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password Is Weak!',
  })
  password: string;
}
