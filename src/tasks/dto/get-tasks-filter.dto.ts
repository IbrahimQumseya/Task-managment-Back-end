/* eslint-disable prettier/prettier */
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
import { ApiProperty } from '@nestjs/swagger';
export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({
    type: String,
    description: 'status',
    enum: TaskStatus,
    required: false,
  })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'search', required: false })
  search?: string;
}
