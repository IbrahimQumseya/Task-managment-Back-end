/* eslint-disable prettier/prettier */

import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';
export class CreateMetaTaskDto {
  @IsString()
  @IsNotEmpty()
  details: string;

  @IsOptional()
  @IsBoolean()
  isDeactivated?: boolean;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
