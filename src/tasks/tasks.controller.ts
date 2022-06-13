/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetTaskMetadaDto } from '../task-metadata/dto/get-tasks-metadata.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-statys.dto';
import { Task } from './task.entity';
import { logger } from './../logger/logger.winston';
import { TasksService } from './tasks.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../gaurds/admin.gaurd';
//jwtStartegy
@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class TasksController {
  constructor(private tasksService: TasksService) {}
  //doing dto for skip and bring <--------------------------
  @Get('/limit/:skip/:bring')
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
    return this.tasksService.getTaskLimitStartEnd(
      Number(skip),
      Number(bring),
      user,
    );
  }
  // not working!!
  // @Get('/:id/details')
  // @ApiOkResponse({ description: 'Get Task details' })
  // @ApiParam({
  //   name: 'taskId',
  //   type: String,
  //   required: true,
  //   description: 'Task ID',
  // })
  // getDetailsTask(
  //   @Param('taskId') taskId: string,
  //   @Query() filterDto?: GetTaskMetadaDto,
  // ): Promise<Task> {
  //   return this.tasksService.getDetailsById(taskId, filterDto);
  // }

  @Get()
  @ApiOkResponse({ description: 'Get all the tasks for a user' })
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    logger.log({
      level: 'verbose',
      message: `User "${
        user.username
      }" retreiving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    });
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Get Task By Id for a user' })
  @ApiParam({ name: 'id', type: String, description: 'Enter Task ID' })
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    logger.log({
      level: 'info',
      message: `user with username of ${user.username} has requested to check task ID of${id}`,
    });
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  @ApiCreatedResponse({ description: 'Delete a Task' })
  @ApiParam({ name: 'id', type: String, description: 'Enter Task ID' })
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    logger.log({
      level: 'verbose',
      message: `user with username of ${user.username} has requested to delete task ID of${id}`,
    });
    return this.tasksService.deleteTaskById(id, user);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create A task' })
  @ApiBody({ type: CreateTaskDto })
  createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    logger.log({
      level: 'verbose',
      message: `User: "${
        user.username
      }" creating new task . Data: ${JSON.stringify(createTaskDto)}`,
    });
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
    logger.log({
      level: 'verbose',
      message: `user with username of ${user.username} has requested to update task status of "${id}" to ${status}`,
    });
    return this.tasksService.updateStatusById(id, status, user);
  }
}
