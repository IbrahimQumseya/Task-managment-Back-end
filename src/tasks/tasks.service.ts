/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskMetadataRepository } from 'src/task-metadata/metatasks.repository';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';
// import { logger } from 'src/logger/logger.winston';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private taskMetadataTask: TaskMetadataRepository,
    private readonly logger: LoggerService,
  ) {}

  async getTaskLimitStartEnd(
    start: number,
    end: number,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTaskLimitStartEnd(start, end, user);
  }

  async getDetailsById(
    taskId: string,
    filterDto?: GetTaskMetadaDto,
  ): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId);
    return this.taskRepository.getDetailsById(task.taskMetadata, filterDto);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      this.logger.logger.log({
        level: 'error',
        message: `Task with ID "${id}" not Found`,
      });
      throw new NotFoundException(`Task with ID "${id}" not Found`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      this.logger.logger.log({
        level: 'error',
        message: `Task with ID "${id}" not Found - delete-Task`,
      });
      throw new NotFoundException(`Task with ID "${id}" not Found`);
    }

    const deletedTask = await this.taskMetadataTask.deleteSelectedTask(task);
  }

  async updateStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = await this.taskRepository.createTask(createTaskDto, user);
    const taskMetadata = await this.taskMetadataTask.createMetadataTask(
      {
        details: 'hello there213',
        taskId: task.id,
        isDeactivated: 'false',
      },
      task,
    );
    return task;
  }
  // createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
  //   return this.taskRepository.createTask(createTaskDto, user);
  // }
}
