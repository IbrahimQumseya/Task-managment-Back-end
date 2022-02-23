/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDetailsDto {
  @IsString()
  @ApiProperty({ type: String, description: 'First Name' })
  firstName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'Last Name' })
  lastName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'Location' })
  location: string;

  @IsString()
  @ApiProperty({ type: String, description: 'Address' })
  address: string;

  @IsString()
  @ApiProperty({ type: String, description: 'Telephone' })
  telephone: string;
}
