/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDetailsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Location' })
  location: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'number' })
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'telephone' })
  telephone: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'address' })
  address: string;
}
