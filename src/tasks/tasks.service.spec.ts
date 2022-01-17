/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
const mockUser = {
  username: 'name',
  id: 'someid',
  password: 'somePassword!1',
  tasks: [],
};
describe('taskService', () => {
  let tasksService: TasksService;
  let tasksRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: TaskRepository, useFactory: mockTasksRepository },
        TasksService,
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls tasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaksId', () => {
    it('calls taksRepository.findeOne and returens the result', async () => {
      const mockTask = {
        title: 'Test title',
        describe: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(null, mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls taksRepository.findeOne and returens the result and handle the thrwo', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
