/* eslint-disable prettier/prettier */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';
// import { logger } from './../logger/logger.winston';
import { TaskMetadata } from 'src/task-metadata/entity/task-metadata.entity';
import { LoggerService } from '../utils/logger';

@Injectable()
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTaskById(id: string): Promise<Task> {
    try {
      const found = await this.findOne(id);
      return found;
    } catch (error) {
      LoggerService.logger.log({
        level: 'error',
        message: `the user is not found "${error}"`,
      });
      throw new NotFoundException(`the user is not found "${id}"`);
    }
  }

  // bug
  async updateStatusById(id: string, status: TaskStatus): Promise<Task> {
    const query = this.createQueryBuilder();
    const task = await this.getTaskById(id);
    if (!task) {
      throw new NotFoundException();
    }
    try {
      const toUpperCase: string = status.toUpperCase();
      const newStatus: TaskStatus = TaskStatus[toUpperCase];
      const res = await query
        .update(Task)
        .set({ status: newStatus })
        .where('id = :id', { id })
        .execute();

      if (res.affected === 1) {
        const task = await this.getTaskById(id);
        return task;
      }
    } catch (error) {
      throw new Error('check error');
    }
  }

  async getTaskLimitStartEnd(
    start: number,
    end: number,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });

    try {
      query.skip(Number(start)).take(Number(end));
      const tasks = query.getMany();
      return tasks;
    } catch (error) {
      LoggerService.logger.log({
        level: 'error',
        message: `the tasks are not found "${error}"`,
      });
      throw new Error(error);
    }
  }

  async getDetailsById(
    taskMetadata: TaskMetadata,
    filterDto?: GetTaskMetadaDto,
  ): Promise<Task> {
    const { details, isDeactivated } = filterDto;
    const query = this.createQueryBuilder('tasks');
    query.where({ taskMetadata });

    // if (details) {
    //   query.andWhere('taskmetadata.details = :details', { details: details });
    // }
    // if (isDeactivated == false) {
    //   query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
    //     isDeactivated: isDeactivated,
    //   });
    // }

    try {
      const res = await query
        // .innerJoinAndSelect('tasks.taskMetadata', 'taskMetadata')
        .getOne();
      console.log(res);

      return res;
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

      LoggerService.logger.log({
        level: 'info',
        message: `Success to get tasks for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)}`,
      });
      return tasks;
    } catch (error) {
      LoggerService.logger.log({
        level: 'error',
        message: `Faild to get tasks for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)} "${error}"`,
      });
      throw new InternalServerErrorException(
        `Faild to get tasks for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)} "${error}"`,
      );
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
      LoggerService.logger.log({
        level: 'error',
        message: `couldn't save the Task "${error}"`,
      });
    }
  }
}
