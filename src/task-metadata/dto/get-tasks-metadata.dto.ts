/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetTaskMetadaDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'details', required: false })
  details?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: String, description: 'isDeactivated', required: false })
  isDeactivated?: boolean;

  // @IsString()
  // @IsNotEmpty()
  // @IsUUID('all')
  // taskId: string;
}
