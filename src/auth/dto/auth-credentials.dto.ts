/* eslint-disable prettier/prettier */
import {
  IsEmail,
  isString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class AuthSignInCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password Is Weak!',
  })
  password: string;

}
