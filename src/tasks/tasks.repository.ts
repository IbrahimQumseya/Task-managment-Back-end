/* eslint-disable prettier/prettier */
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { use } from 'passport';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';
import { logger } from './../logger/logger.winston';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTaskById(id: string): Promise<Task> {
    try {
      const found = await this.findOne(id);
      return found;
    } catch (error) {
      logger.log('error', `the user is not found "${error}"`);
      throw new NotFoundException(`the user is not found "${id}"`);
    }
  }

  async getTaskLimitStartEnd(
    start: number,
    end: number,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder();
    try {
      query.where({ user }).skip(start).take(end);
      const tasks = query.getMany();
      return tasks;
    } catch (error) {
      logger.log('error', `the tasks are not found "${error}"`);
      throw new Error(error);
    }
  }

  async getDetailsById(
    task: Task,
    id: string,
    filterDto: GetTaskMetadaDto,
  ): Promise<Task> {
    const { details, isDeactivated } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ taskMetadata: id, limit: 1 });

    // if (details) {
    //   query.andWhere('taskmetadata.details = :details', { details: details });
    // }
    // if (isDeactivated == false) {
    //   query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
    //     isDeactivated: isDeactivated,
    //   });
    // }

    try {
      const detailss = await query
        .innerJoinAndSelect('task.taskMetadata', 'taskMetadata')
        .getOne();
      return detailss;
      //return details;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query
        .innerJoinAndSelect('task.user', 'user')
        .innerJoinAndSelect(
          'task.taskMetadata',
          'taskMetadata',
          "taskMetadata.isDeactivated= 'true'",
        )
        .getMany();

      return tasks;
    } catch (error) {
      logger.log(
        'error',
        `Faild to get tasks for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)} "${error}"`,
      );
      throw new InternalServerErrorException();
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    try {
      await this.save(task);
      return task;
    } catch (error) {
      logger.log('error', `couldn't save the Task "${error}"`);
    }
  }
}
