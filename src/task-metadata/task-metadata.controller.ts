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
import { userInfo } from 'os';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
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
  getAllDetailsTasks(
    @Param('id') id: string,
    @Query() filterDto: GetTaskMetadaDto,
    @Query() task: Task,
  ): Promise<TaskMetadata[]> {
    return this.tasksMetadataService.getTaskDetails(filterDto, task, id);
  }
  // @Get('/:id')
  // getTasksDetails(
  //   @Param('id') id: string,
  //   @GetUser() user: User,
  // ): Promise<TaskMetadata> {
  //   return this.tasksMetadataService.getTaskDetails(id, user);
  // }
  @Post()
  createMetadataTask(
    @Body() createMetaTaskDto: CreateMetaTaskDto,
  ): Promise<TaskMetadata> {
    return this.tasksMetadataService.createMetadataTask(createMetaTaskDto);
    // }
  }
}
