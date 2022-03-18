/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '../tasks/tasks.repository';
import { TaskStatus } from '../tasks/task-status.enum';
import { TaskMetadataRepository } from './metatasks.repository';
import { TaskMetadataController } from './task-metadata.controller';
import { TaskMetadataService } from './task-metadata.service';
import { UserRole } from '../auth/enum/user-role.enum';
const mockUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: '',
    number: 2341,
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
const ApiTaskMetadataService = {
  provide: TaskMetadataService,
  useFactory: () => ({
    getAllTasksDetails: jest.fn(),
    getTaskDetail: jest.fn(),
    createMetadataTask: jest.fn(),
  }),
};
const ApiTaskMetadataRepository = {
  provide: TaskMetadataRepository,
  useFactory: () => ({
    getAllTasksDetails: jest.fn(),
    getTaskDetail: jest.fn(),
    createMetadataTask: jest.fn(),
  }),
};
describe('Tasks Controller', () => {
  let taskMetadataController: TaskMetadataController;
  let tasksMetadataService: TaskMetadataService;
  let taskMetadataRepository: TaskMetadataRepository;
  let taskRepository: TaskRepository;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskMetadataController],
      providers: [
        TaskRepository,
        TaskMetadataService,
        ApiTaskMetadataService,
        ApiTaskMetadataRepository,
      ],
    }).compile();
    taskMetadataController = app.get<TaskMetadataController>(
      TaskMetadataController,
    );
    tasksMetadataService = app.get<TaskMetadataService>(TaskMetadataService);

    taskMetadataRepository = app.get(TaskMetadataRepository);
    taskRepository = app.get(TaskRepository);
  });
  describe('TaskMetadataController', () => {
    it('calls TaskMetadataService.getTasks and returns the result', async () => {
      await taskMetadataController.getDetailsTaskById('someId');
      expect(tasksMetadataService.getTaskDetail).toHaveBeenCalled();
    });
    it('calls TaskMetadataService.getAllTasksDetails and returns the result', async () => {
      await taskMetadataController.getAllTaskDetails(null, mockTask);
      expect(tasksMetadataService.getAllTasksDetails).toHaveBeenCalled();
    });
    it('calls TaskMetadataService.createMetadataTask and returns the result', async () => {
      await taskMetadataController.createMetadataTask({
        details: 'details',
        taskId: 'someId',
        isDeactivated: 'true',
      });
      expect(tasksMetadataService.createMetadataTask).toHaveBeenCalled();
    });
  });
});
