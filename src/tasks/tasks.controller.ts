import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-statys.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
//jwtStartegy
@Controller('tasks')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get('/:start/:end')
  @ApiOkResponse({ description: 'Get tasks by limit' })
  @ApiParam({
    name: 'skip',
    type: Number,
    description: 'at what row should be start',
    required: true,
  })
  @ApiParam({
    name: 'bring',
    type: Number,
    description: 'How many rows it will return',
    required: true,
  })
  getTaskLimitStartEnd(
    @Param('skip') skip: number,
    @Param('bring') bring: number,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTaskLimitStartEnd(skip, bring, user);
  }

  @Get('/:id/details')
  @ApiOkResponse({ description: 'Get Task details' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Task ID',
  })
  getDetailsTask(
    @Query('task') task: Task,
    @Param('id') id: string,
    @Query('filterDto') filterDto: GetTaskMetadaDto,
  ): Promise<Task> {
    return this.tasksService.getDetailsById(task, id, filterDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Get all the tasks for a user' })
  getTasks(
    @Query('filterDto') filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retreiving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Get Task By Id for a user' })
  @ApiParam({ name: 'id', type: String, description: 'Enter Task ID' })
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  @ApiCreatedResponse({ description: 'Delete a Task' })
  @ApiParam({ name: 'id', type: String, description: 'Enter Task ID' })
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create A task' })
  @ApiBody({ type: CreateTaskDto })
  createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    this.logger.verbose(
      `User: "${user.username}" creating new task . Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  @ApiCreatedResponse({ description: 'Update a task status' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiParam({ name: 'id', type: String, description: 'Enter Task ID' })
  updateStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateStatusById(id, status, user);
  }
}
