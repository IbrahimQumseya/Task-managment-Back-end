/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
export class GetTaskMetadaDto {
  @IsString()
  @IsOptional()
  details?: string;

  @IsOptional()
  @IsBoolean()
  isDeactivated?: boolean;

  // @IsString()
  // @IsNotEmpty()
  // @IsUUID('all')
  // taskId: string;
}
