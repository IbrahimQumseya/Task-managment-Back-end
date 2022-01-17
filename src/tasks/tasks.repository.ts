/* eslint-disable prettier/prettier */
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { use } from 'passport';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskMetadata } from 'src/task-metadata/entity/task-metadata.entity';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });
  

  async getTaskById(
    id: string
  ): Promise<Task> {
    return this.findOne(id);
  }
  async getDetailsById(
    user: User,
    id: string,
    filterDto: GetTaskMetadaDto,
  ): Promise<Task> {
    const { details, isDeactivated } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user, id: id });

    if (details) {
      query.andWhere('taskmetadata.details = :details', { details: details });
    }
    if (isDeactivated == false) {
      query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
        isDeactivated: isDeactivated,
      });
    }

    try {
      const _details = await query
        .innerJoinAndSelect('task.taskMetadata', 'taskMetadata')
        .getMany();
      //return details;
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return new Task();
  }
  // async getMetadataTask(
  //   filterDto: GetTaskMetadaDto,
  //   task: Task,
  //   user: User,
  // ): Promise<TaskMetadata[]> {
  //   const { isDeactivated, details } = filterDto;
  //   const query = this.createQueryBuilder('taskmetadata');
  //   query.where({ user });
  //   if (details) {
  //     query.andWhere('taskmetadata.details = :details', { details: details });
  //   }
  //   if (isDeactivated) {
  //     query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
  //       isDeactivated: isDeactivated,
  //     });
  //   }

  //   try {
  //     const metaTask = await query
  //       .innerJoinAndSelect('taskmetadata.task', 'task')
  //       .getMany();
  //     return metaTask;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }
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
      // const metaTask = await query
      //   .innerJoinAndSelect('task.metadata', 'metadata')
      //   .getMany();
      const _tasks = await query.getMany();
      return _tasks;
    } catch (error) {
      this.logger.error(
        `Faild to get tasks for user "${use.name}". Filter: ${JSON.stringify(
          filterDto,
        )}`,
        error.stak,
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
    await this.save(task);
    return task;
  }

  // async createMetadataTask(
  //   createMetaTaskDto: CreateMetaTaskDto,
  //   metaTask: TaskMetadata,
  // ): Promise<TaskMetadata> {
  //   const { details, isDeactivated } = createMetaTaskDto;
  //   const metaTasks = this.create({});
  //   return metaTask;
  // }
}
