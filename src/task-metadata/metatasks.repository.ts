/* eslint-disable prettier/prettier */
import { Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task } from 'src/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMetaTaskDto } from './dto/create-metaTask.dto';
import { GetTaskMetadaDto } from './dto/get-tasks-metadata.dto';
import { TaskMetadata } from './entity/task-metadata.entity';

@EntityRepository(TaskMetadata)
export class TaskMetadataRepository extends Repository<TaskMetadata> {
  private logger = new Logger('TaskMetadataRepository', { timestamp: true });

  async getAllTasksDetails(
    filterDto: GetTaskMetadaDto,
    task: Task,
  ): Promise<TaskMetadata[]> {
    const { details, isDeactivated } = filterDto;

    const query = this.createQueryBuilder('taskmetadata');
    query.where({ task });
    if (details) {
      query.andWhere('taskmetadata.details = :details', { details });
    }
    if (!isDeactivated) {
      query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
        isDeactivated,
      });
    }
    try {
      const detailss = await query
        .innerJoinAndSelect('taskmetadata.task', 'task')
        .getMany();
      console.log(detailss);
      return detailss;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getTasksDetails(
    filterDto: GetTaskMetadaDto,
    task: Task,
    id: string,
  ): Promise<TaskMetadata[]> {
    const { details } = filterDto;
    const query = this.createQueryBuilder('taskmetadata');

    const isDeactivated = false;
    query.where({ task: id });

    if (details) {
      query.andWhere('taskmetadata.details = :details', { details });
    }
    if (!isDeactivated) {
      query.andWhere('taskmetadata.isDeactivated = :isDeactivated', {
        isDeactivated,
      });
    }
    try {
      const detailss = await query
        .innerJoinAndSelect('taskmetadata.task', 'task')
        .getMany();
      console.log(detailss);
      return detailss;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createMetadataTask(
    createMetaTaskDto: CreateMetaTaskDto,
    task: Task,
  ): Promise<TaskMetadata> {
    const { details, isDeactivated } = createMetaTaskDto;

    console.log(isDeactivated);
    console.log(isDeactivated);
    const metaTasks = this.create({
      
      details: details,
      isDeactivated: Boolean(isDeactivated),
      id: uuid(),
      task,
    });
    await this.save(metaTasks);
    return metaTasks;
  }
}
