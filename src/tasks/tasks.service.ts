/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskMetadataRepository } from '../task-metadata/metatasks.repository';
import { GetTaskMetadaDto } from '../task-metadata/dto/get-tasks-metadata.dto';
import { TaskMetadata } from '../task-metadata/entity/task-metadata.entity';
import { createQueryBuilder } from 'typeorm';
import { logger } from '../logger/logger.winston';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private taskMetadataTask: TaskMetadataRepository,
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
    const taskMetadata = await this.taskMetadataTask.getTaskDetail(taskId);
    return this.taskRepository.getDetailsById(taskMetadata, filterDto);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      logger.log('error', `Task with ID "${id}" not Found`);
      throw new NotFoundException(`Task with ID "${id}" not Found`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    const deletedTask = await this.taskMetadataTask.deleteSelectedTask(task);
  }

  async updateStatusById(
    taskId: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    try {
      const query = await this.taskRepository
        .createQueryBuilder('')
        .update(Task)
        .set({ status: status })
        .where('id=:taskId', { taskId })
        .execute();

      const task = await this.getTaskById(taskId, user);
      return task;
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
