/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNull } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable prettier/prettier */
export class AuthSignUpCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ type: String, description: 'Username' })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'password' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password Is Weak!',
  })
  password: string;

  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ type: String, description: 'firstName' })
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ type: String, description: 'lastName' })
  lastName: string;
  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // username: string;

  // @IsString()
  // @MinLength(8)
  // @MaxLength(32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password Is Weak!',
  // })
  // password: string;

  // email: string;

  // firstName: string;

  // lastName: string;
}
