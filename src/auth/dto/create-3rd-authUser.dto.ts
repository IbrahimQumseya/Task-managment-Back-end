import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginOption } from '../enum/user-log-in-enum';

export class Create3rdAuthUser {
  @IsString()
  id: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ type: String, description: 'Username' })
  username: string;

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

  @IsEnum(LoginOption)
  @ApiProperty({ type: Enumerator, description: 'With what user logged in' })
  signWith: LoginOption;
}
