/* eslint-disable prettier/prettier */

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
export class CreateMetaTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'details' })
  details: string;

  @IsOptional()
  @IsString()
  // @IsBoolean()
  @ApiProperty({ type: String, description: 'isDeactivated' })
  isDeactivated?: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'taskId' })
  taskId: string;
}
