/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../auth/enum/user-role.enum';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const mockUser: User = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: '',
    number: 205,
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
const ApiTasksService = {
  provide: TasksService,
  useFactory: () => ({
    getTaskLimitStartEnd: jest.fn(),
    getDetailsById: jest.fn(),
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateStatusById: jest.fn(),
    deleteTaskById: jest.fn(),
  }),
};
describe('Tasks Controller', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, ApiTasksService],
    }).compile();
    tasksController = app.get<TasksController>(TasksController);
    tasksService = app.get<TasksService>(TasksService);
  });

  describe('TasksController', () => {
    it('calls TaskService.getTasks and returns the result', async () => {
      tasksController.getTasks(null, mockUser);
      expect(tasksService.getTasks).toHaveBeenCalled();
    });
    it('calls TaskService.getTaskLimitStartEnd and returns the result', async () => {
      tasksController.getTaskLimitStartEnd(1, 1, mockUser);
      expect(tasksService.getTaskLimitStartEnd).toHaveBeenCalled();
    });
    // it('calls TaskService.getDetailsById and returns the result', async () => {
    //   tasksController.getDetailsTask(mockTask, 'someId', {
    //     details: 'details',
    //     isDeactivated: true

    //   });
    // expect(tasksService.getDetailsById).toHaveBeenCalled();
  });
  it('calls TaskService.getTaskById and returns the result', async () => {
    tasksController.getTaskById('someId', mockUser);
    expect(tasksService.getTaskById).toHaveBeenCalled();
  });
  it('calls TaskService.deleteTaskById and returns the result', async () => {
    tasksController.deleteTaskById('someId', mockUser);
    expect(tasksService.deleteTaskById).toHaveBeenCalled();
  });
  it('calls TaskService.createTask and returns the result', async () => {
    tasksController.createTask(mockUser, {
      description: 'someDesc',
      title: 'someTitle',
    });
    expect(tasksService.createTask).toHaveBeenCalled();
  });
  it('calls TaskService.updateStatusById and returns the result', async () => {
    tasksController.updateStatusById(
      'someId',
      { status: TaskStatus.DONE },
      mockUser,
    );
    expect(tasksService.updateStatusById).toHaveBeenCalled();
  });
});
// });
