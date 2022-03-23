import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDetailsDto } from '../auth/dto/updateUser-userDetails.dto';
import { UserRole } from '../auth/enum/user-role.enum';
import { User } from '../auth/user.entity';
import { TaskStatus } from '../tasks/task-status.enum';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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

const apiUsersService = {
  provide: UsersService,
  useFactory: () => ({
    getProfileImage: jest.fn(),
    uploadFile: jest.fn(),
    updateUser: jest.fn(),
    updateUserRole: jest.fn(),
    getRolesForUser: jest.fn(),
  }),
};

describe('Users Controllers', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, apiUsersService],
    }).compile();
    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('getProfileImage', () => {
    it('calls UsersService.getProfileImage and returns the result', async () => {
      usersController.getProfileImage(mockUser, 'any');
      expect(usersService.getProfileImage).toHaveBeenCalled();
    });
  });

  //   describe('uploadFile', () => {
  //     it('calls UsersService.uploadFile and returns the result', async () => {
  //     //   usersController.uploadFile(new File(), 'any');
  //       expect(usersService.uploadFile).toHaveBeenCalled();
  //     });
  //   });

  describe('updateUser', () => {
    it('calls UsersService.updateUser and returns the result', async () => {
      const dto: UpdateUserDetailsDto = {
        address: 'asd',
        firstName: 'asd',
        lastName: 'asd',
        location: 'asd',
        number: '254',
        telephone: '243',
      };
      usersController.updateUser(mockUser, dto);
      expect(usersService.updateUser).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('calls UsersService.updateUserRole and returns the result', async () => {
      usersController.updateUserRole('someId', UserRole.ADMIN);
      expect(usersService.updateUserRole).toHaveBeenCalled();
    });
  });

  describe('getRolesForUser', () => {
    it('calls UsersService.getRolesForUser and returns the result', async () => {
      usersController.getRolesForUser();
      expect(usersService.getRolesForUser).toHaveBeenCalled();
    });
  });
});
