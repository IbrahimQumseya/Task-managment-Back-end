import { Module } from '@nestjs/common';
import { TaskMetadataService } from './task-metadata.service';
import { TaskMetadataController } from './task-metadata.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskMetadata } from './entity/task-metadata.entity';
import { TaskMetadataRepository } from './metatasks.repository';
import { TaskRepository } from '../tasks/tasks.repository';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TaskMetadata,
      TaskRepository,
      TaskMetadataRepository,
    ]),
  ],
  providers: [TaskMetadataService, LoggerService],
  controllers: [TaskMetadataController],
})
export class TaskMetadataModule {}
