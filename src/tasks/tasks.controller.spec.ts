/* eslint-disable prettier/prettier */
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { TaskMetadata } from '../task-metadata/entity/task-metadata.entity';
import { TaskMetadataRepository } from '../task-metadata/metatasks.repository';
import { TaskMetadataService } from '../task-metadata/task-metadata.service';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
// const mockTasksMetadataRepository = () => ({
//   getTasks: jest.fn(),
//   findOne: jest.fn(),
// });
const mockUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: '',
    number: '',
    telephone: 156489,
    address: '',
    id: '',
    user: null,
  },
  firstName: '',
  lastName: '',
  id: '',
  email: '',
  isDeactivated: true,
};
describe('Tasks Controller', () => {
  let tasksService: TasksService;
  let tasksRepository: TaskRepository;
  let taskMetadataRepository: TaskMetadataRepository;
  let taskMetadataService: TaskMetadataService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        PassportModule,
        TasksService,
        TaskMetadataRepository,
        TaskMetadataService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = moduleRef.get(TasksService);
    tasksRepository = moduleRef.get(TaskRepository);
    taskMetadataService = moduleRef.get(TaskMetadataService);
    taskMetadataRepository = moduleRef.get(TaskMetadataRepository);
  });

  describe('getTasks', () => {
    it('calls tasksRepository.getTasks and returns the result', async () => {
      //   const filterDto = { status: TaskStatus.OPEN, search: 'a' };
      tasksRepository.getTasks(null, mockUser);
      const result = await tasksService.getTasks(null, mockUser);
      // console.log(result);

      // expect(result).toEqual('someValue');
    });
  });
});
