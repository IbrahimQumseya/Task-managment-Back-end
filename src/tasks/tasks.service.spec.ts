import { Test } from '@nestjs/testing';
import { UserDetails } from '../user-details/entity/user-details.entity';
import { TaskMetadataRepository } from '../task-metadata/metatasks.repository';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../auth/enum/user-role.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  getTaskLimitStartEnd: jest.fn(),
  getDetailsById: jest.fn(),
  updateStatusById: jest.fn(),
});
const mockTasksMetadataRepository = () => ({
  createMetadataTask: jest.fn(),
  deleteSelectedTask: jest.fn(),
  getTaskDetail: jest.fn(),
});
// const taskMetadata = {
//   id: 'soomeId',
//   details: 'someDetails',
//   isDeactivated: true,
//   task,
// };
const someUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: '',
    number: 345,
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
  role: UserRole.USER,
  profileImage: '',
};

const mockUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: 'asd',
    number: 342,
    telephone: 156489,
    address: 'asd',
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

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;
  let taskMetadataRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskMetadataRepository,
          useFactory: mockTasksMetadataRepository,
        },
        UserDetails,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
    taskMetadataRepository = module.get(TaskMetadataRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.tasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, someUser);
      expect(result).toBe('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.getTaskById result the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.getTaskById and handle the error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('createTask taskRepository.createTask and return value', async () => {
      const createTaskDto = {
        title: 'someTitle',
        description: 'someDesc',
      };
      const task = tasksRepository.createTask.mockResolvedValue(
        mockTask,
        mockUser,
      );
      const taskMetadata =
        taskMetadataRepository.createMetadataTask.mockResolvedValue(
          {
            details: 'hello there213',
            taskId: task.id,
            isDeactivated: 'false',
          },
          task,
        );

      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskLimitStartEnd', () => {
    it('get taskRepository.getTaskLimitStartEnd and return value', async () => {
      const start = 5;
      const end = 5;
      const tasks =
        await tasksRepository.getTaskLimitStartEnd.mockResolvedValue(
          start,
          end,
          mockUser,
        );
      const result = await tasksService.getTaskLimitStartEnd(
        start,
        end,
        mockUser,
      );

      expect(result).toEqual(end);
    });
  });

  describe('deletTaskById', () => {
    it('TaskRepository.deleteSelectedTask and return success', async () => {
      const task = await tasksRepository.findOne.mockResolvedValue({
        id: 'someId',
        user: mockUser,
      });
      const deletedTask =
        await taskMetadataRepository.deleteSelectedTask.mockResolvedValue(task);
      const result = await tasksService.deleteTaskById('someId', mockUser);

      expect(result).toBe(undefined);
    });
  });

  //Error executing the query

  // describe('updateStatusById', () => {
  //   it('upDate Status by Id and return new task', async () => {
  //     tasksRepository.findOne.mockResolvedValue(mockTask);
  //     const find = await tasksService.getTaskById('someId', mockUser);
  //     expect(find).toEqual(mockTask);

  //     const test = tasksRepository.updateStatusById.mockResolvedValue(
  //       find.id,
  //       TaskStatus.IN_PROGRESS,
  //     );
  //     console.log(find.id);
  //     const result = await tasksService.updateStatusById(
  //       find.id,
  //       TaskStatus.IN_PROGRESS,
  //       mockUser,
  //     );
  //     expect(result).toBe(find.id);
  //   });
  // });
});
