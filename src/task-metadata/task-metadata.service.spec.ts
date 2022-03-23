/* eslint-disable prettier/prettier */

import { Test } from '@nestjs/testing';
import { TaskStatus } from '../tasks/task-status.enum';
import { TasksService } from '../tasks/tasks.service';
import { TaskRepository } from '../tasks/tasks.repository';
import { TaskMetadataRepository } from './metatasks.repository';
import { TaskMetadataService } from './task-metadata.service';
import { UserRole } from '../auth/enum/user-role.enum';
const mockUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: 'asd',
    number: 2314,
    telephone: 156489,
    address: '667',
    id: 'asd',
    user: null,
  },
  firstName: 'asd',
  lastName: 'asd',
  id: 'asdd',
  email: 'asd',
  isDeactivated: true,
  role: UserRole.USER,
  profileImage: '',
};
const mockTask = {
  title: 'TestTitle',
  description: 'Test desc',
  id: 'someId',
  status: TaskStatus.OPEN,
  taskMetadata: {
    id: 'soomeId',
    details: 'someDetails',
    isDeactivated: true,
    task: null,
  },
  user: mockUser,
};
const mockTasksRepository = () => ({
  getTaskById: jest.fn(),
});
const mockTasksMetadataRepository = () => ({
  createMetadataTask: jest.fn(),
  getAllTasksDetails: jest.fn(),
  getTaskDetail: jest.fn(),
});
describe('taskMetaDataService', () => {
  let taskMetadataService: TaskMetadataService;
  let taskRepository;
  let taskMetadataRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskMetadataService,
        {
          provide: TaskMetadataRepository,
          useFactory: mockTasksMetadataRepository,
        },
        {
          provide: TaskRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();
    taskMetadataService = module.get(TaskMetadataService);
    taskRepository = module.get(TaskRepository);
    taskMetadataRepository = module.get(TaskMetadataRepository);
  });
  describe('TaskMetaDataService', () => {
    it('calls TaskMetadataService.getAllTasksDetails and returns the result', async () => {
      taskMetadataRepository.getAllTasksDetails.mockResolvedValue(
        {
          details: 's',
          isDeactivated: true,
        },
        mockTask,
      );
      const result = await taskMetadataService.getAllTasksDetails(
        { details: 's', isDeactivated: true },
        mockTask,
      );
      expect(result).toStrictEqual({
        details: 's',
        isDeactivated: true,
      });
    });
    it('calls TaskMetadataService.createMetadataTask and returns the result', async () => {
      const createMetaTaskDto = {
        details: 'details',
        taskId: 'someId',
        isDeactivated: 'true',
      };
      const task = taskRepository.getTaskById.mockResolvedValue(
        createMetaTaskDto.taskId,
      );
      taskMetadataRepository.createMetadataTask.mockResolvedValue(
        createMetaTaskDto,
        task,
      );
      const result = await taskMetadataService.createMetadataTask(
        createMetaTaskDto,
      );
      expect(result).toBe(createMetaTaskDto);
    });
    it('calls TaskMetadataService.getTaskDetail and returns the result', async () => {
      taskMetadataRepository.getTaskDetail.mockResolvedValue('someId');
      const result = await taskMetadataService.getTaskDetail('someId');
      expect(result).toBe('someId');
    });
  });
});
