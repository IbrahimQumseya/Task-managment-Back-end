/* eslint-disable prettier/prettier */
import { Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task } from '../tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMetaTaskDto } from './dto/create-metaTask.dto';
import { GetTaskMetadaDto } from './dto/get-tasks-metadata.dto';
import { TaskMetadata } from './entity/task-metadata.entity';
import { logger } from 'src/logger/logger.winston';

@EntityRepository(TaskMetadata)
export class TaskMetadataRepository extends Repository<TaskMetadata> {

  async deleteSelectedTask(task: Task): Promise<void> {
    const findMetaTask = await this.getTaskDetail(task.id);
    if (findMetaTask) {
      const result = await this.delete(findMetaTask);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID"${task.id}"not found`);
      }
    } else {
      throw new NotFoundException(`Task with ID"${task.id}"not found`);
    }
  }

  async getAllTasksDetails(
    filterDto: GetTaskMetadaDto,
    task: Task,
  ): Promise<TaskMetadata[]> {
    const { details, isDeactivated } = filterDto;
    const query = this.createQueryBuilder('taskMetadata');
    query.where({ task });
    if (details) {
      query.andWhere('taskMetadata.details = :details', { details });
    }
    // if (isDeactivated) {
    //   console.log('-----------------', booleanActivated);
    //   query.andWhere(`taskMetadata.isDeactivated = ${isDeactivated} `);
    // }
    try {
      const details = await query
        .innerJoinAndSelect('taskMetadata.task', 'task')
        .getMany();
      logger.log(
        'verbose',
        `Getting All Task Metadata with filters of  ${JSON.stringify(
          filterDto,
        )} , Success!`,
      );
      return details;
    } catch (error) {
      logger.log(
        'error',
        `Getting All Task Metadata with filters of  ${JSON.stringify(
          filterDto,
        )} , FAILED!`,
      );
      throw new NotFoundException();
    }
  }

  async getTaskDetail(taskId: string): Promise<TaskMetadata> {
    const query = this.createQueryBuilder('taskMetadata');
    try {
      const details = await query
        .andWhere('taskMetadata.taskId = :taskId', { taskId })
        .getOne();

      logger.log(
        'verbose',
        `Getting Task Metadata of task ID = "${taskId}" , Success!`,
      );
      return details;
    } catch (error) {
      logger.log(
        'error',
        `Getting Task Metadata of task ID = "${taskId}" "NotFound" , Failed!`,
      );
      throw new NotFoundException(
        `Getting Task Metadata of task ID = "${taskId}" "NotFound" , Failed!`,
      );
    }
  }

  async createMetadataTask(
    createMetaTaskDto: CreateMetaTaskDto,
    task: Task,
  ): Promise<TaskMetadata> {
    const { details, isDeactivated } = createMetaTaskDto;
    const metaTasks = this.create({
      details: details,
      isDeactivated: Boolean(isDeactivated),
      id: uuid(),
      task,
    });
    try {
      await this.save(metaTasks);
      logger.log('verbose', `Create Task Metadata   , Success!`);
      return metaTasks;
    } catch (error) {
      logger.log('error', `Create Task Metadata "ERROR" "${error}"   , Failed!`);
    }
  }
}
