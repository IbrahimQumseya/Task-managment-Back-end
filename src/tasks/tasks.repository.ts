/* eslint-disable prettier/prettier */
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { use } from 'passport';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTaskMetadaDto } from 'src/task-metadata/dto/get-tasks-metadata.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });

  async getTaskById(id: string): Promise<Task> {
    return this.findOne(id);
  }

  async updateStatusById(
    id: string,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.save(task);
    return task;
  }

  async getTaskLimitStartEnd(
    start: number,
    end: number,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });

    try {
      query.skip(start).take(end);
      const task = query.getMany();
      return task;
    } catch (error) {
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
        // .innerJoinAndSelect('task.taskMetadata', 'taskMetadata')
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
}
