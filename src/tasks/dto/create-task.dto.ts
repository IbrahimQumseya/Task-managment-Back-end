/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'title' })
  title: string;
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'description' })
  description: string;
}
