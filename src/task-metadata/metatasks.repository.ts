/* eslint-disable prettier/prettier */
import { Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task } from 'src/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMetaTaskDto } from './dto/create-metaTask.dto';
import { GetTaskMetadaDto } from './dto/get-tasks-metadata.dto';
import { TaskMetadata } from './entity/task-metadata.entity';
import { TaskRepository } from './../tasks/tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(TaskMetadata)
export class TaskMetadataRepository extends Repository<TaskMetadata> {
  private logger = new Logger('TaskMetadataRepository', { timestamp: true });
  async getTasksDetails(
    filterDto: GetTaskMetadaDto,
    task: Task,
    id: string,
  ): Promise<TaskMetadata[]> {
    const { details, isDeactivated } = filterDto;
    const query = this.createQueryBuilder('taskmetadata');

    query.where({ task: id });
    
    if (details) {
      query.andWhere('taskmetadata.details = :details', { details });
    }
    if (isDeactivated) {
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
  // async getTaskById(id: string, user: User): Promise<TaskMetadata> {
  //   const found = await this.findOne({ where: { id: id } });

  //   if (!found) {
  //     throw new NotFoundException(`Task with ID " ${id} " not Found`);
  //   }
  //   return found;
  // }

  async createMetadataTask(
    createMetaTaskDto: CreateMetaTaskDto,
    task: Task,
  ): Promise<TaskMetadata> {
    const { details, isDeactivated, taskId } = createMetaTaskDto;

    const metaTasks = this.create({
      details: details,
      isDeactivated: isDeactivated,
      id: uuid(),
      task,
    });
    await this.save(metaTasks);
    return metaTasks;
  }
}
