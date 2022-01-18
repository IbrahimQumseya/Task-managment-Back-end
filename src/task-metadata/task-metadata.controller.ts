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
import { Task } from 'src/tasks/task.entity';
import { CreateMetaTaskDto } from './dto/create-metaTask.dto';
import { GetTaskMetadaDto } from './dto/get-tasks-metadata.dto';
import { TaskMetadata } from './entity/task-metadata.entity';
import { TaskMetadataService } from './task-metadata.service';

@Controller('task-metadata')
@UseGuards(AuthGuard())
export class TaskMetadataController {
  private logger = new Logger('TasksController');
  constructor(private tasksMetadataService: TaskMetadataService) {}

  @Get('/:id/details')
  getDetailsTaskById(
    @Param('id') id: string,
    @Query() filterDto: GetTaskMetadaDto,
    @Query() task: Task,
  ): Promise<TaskMetadata[]> {
    return this.tasksMetadataService.getTaskDetails(filterDto, task, id);
  }
  @Get()
  getAllTaskDetails(
    @Query() filterDto: GetTaskMetadaDto,
    @Query() task: Task,
  ): Promise<TaskMetadata[]> {
    return this.tasksMetadataService.getAllTasksDetails(filterDto, task);
  }
  @Post()
  createMetadataTask(
    @Body() createMetaTaskDto: CreateMetaTaskDto,
  ): Promise<TaskMetadata> {
    return this.tasksMetadataService.createMetadataTask(createMetaTaskDto);
    // }
  }
}
