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
import { TaskMetadata } from 'src/task-metadata/entity/task-metadata.entity';
import { createQueryBuilder } from 'typeorm';
import { logger } from 'src/logger/logger.winston';
import { UsersRepository } from '../auth/users.respository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(TaskMetadataRepository)
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
    return this.taskRepository.getDetailsById(task.taskMetadata, filterDto);
  }

  async getAllTasksByAdmin(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getAllTasksByAdmin(filterDto);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string): Promise<Task> {
    // const found = await this.taskRepository.findOne({ where: { id, user } });
    // const found = await this.getTaskById(id);

    // if (!found) {
    //   logger.log('error', `Task with ID "${id}" not Found`);
    //   throw new NotFoundException(`Task with ID "${id}" not Found`);
    // }
    return this.taskRepository.getTaskById(id);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    const deletedTask = await this.taskMetadataTask.deleteSelectedTask(task);
  }

  async updateStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.updateStatusById(id, status);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const user = await this.userRepository.getUser(userId);
    if (user) {
      const task = await this.taskRepository.createTask(createTaskDto, user);
      const taskMetadata = await this.taskMetadataTask.createMetadataTask(
        {
          details: '',
          taskId: task.id,
          isDeactivated: 'false',
        },
        task,
      );
      const newTask = await this.taskRepository.getTaskById(task.id);
      return newTask;
    }
    throw new NotFoundException(`${userId} NOT FOUND`);
  }
  // createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
  //   return this.taskRepository.createTask(createTaskDto, user);
  // }
}
