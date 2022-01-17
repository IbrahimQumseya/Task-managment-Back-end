/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class GetTaskMetadaDto {
  @IsString()
  @IsOptional()
  details?: string;

  @IsOptional()
  @IsBoolean()
  isDeactivated?: boolean;
}
