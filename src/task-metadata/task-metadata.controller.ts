import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from '../tasks/task.entity';
import { CreateMetaTaskDto } from './dto/create-metaTask.dto';
import { GetTaskMetadaDto } from './dto/get-tasks-metadata.dto';
import { TaskMetadata } from './entity/task-metadata.entity';
import { TaskMetadataService } from './task-metadata.service';
import {
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('Task-Metadata')
@Controller('task-metadata')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class TaskMetadataController {
  private logger = new Logger('TasksController');
  constructor(private tasksMetadataService: TaskMetadataService) {}

  @Get('/:taskId/details')
  @ApiOkResponse({ description: 'Get Task details' })
  @ApiParam({ name: 'taskId', description: 'Task ID', type: String })
  getDetailsTaskById(@Param('taskId') taskId: string): Promise<TaskMetadata> {
    return this.tasksMetadataService.getTaskDetail(taskId);
  }

  @Get()
  @ApiOkResponse({ description: 'Get all task details' })
  getAllTaskDetails(
    @Query() filterDto: GetTaskMetadaDto,
    @Query() task: Task,
  ): Promise<TaskMetadata[]> {
    return this.tasksMetadataService.getAllTasksDetails(filterDto, task);
  }
  
  @Post()
  @ApiCreatedResponse({ description: 'Create Metadata Task' })
  @ApiBody({ type: CreateMetaTaskDto })
  createMetadataTask(
    @Body() createMetaTaskDto: CreateMetaTaskDto,
  ): Promise<TaskMetadata> {
    return this.tasksMetadataService.createMetadataTask(createMetaTaskDto);
    // }
  }
}
