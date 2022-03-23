import { Test } from '@nestjs/testing';
import { UpdateUserDetailsDto } from '../auth/dto/updateUser-userDetails.dto';
import { UserRole } from '../auth/enum/user-role.enum';
import { UsersRepository } from '../auth/users.respository';
import { TaskStatus } from '../tasks/task-status.enum';
import { UserDetails } from '../user-details/entity/user-details.entity';
import { UserDetailsRepository } from '../user-details/user-details.repository';
import { UsersService } from './users.service';

// const mockTask1 = {
//   id: '5f8b7365-50b9-48cf-a6dc-e58a9f54e2e2',
//   title: 'eat food232aawwa425',
//   description: 'lots of cleaning has to be done34sdd234234',
//   status: 'OPEN',
//   user: {
//     id: 'fae03917-c7fc-4e94-9623-49ff56c9634b',
//     username: 'user121',
//     firstName: 'ibra',
//     lastName: 'qum',
//     email: 'ibrahi@hot.com',
//     isDeactivated: false,
//     role: 'USER',
//     profileImage:
//       'WhatsAppImage2021-10-21at13.39.10c3267776-fe9d-4067-9f98-8c785c532819.jpeg',
//   },
//   taskMetadata: {
//     id: 'f0f13157-0921-4bd1-977c-c8a3602eb354',
//     details: 'hello there213',
//     isDeactivated: true,
//   },
// };

const dto: UpdateUserDetailsDto = {
  address: 'asd',
  firstName: 'asd',
  lastName: 'asd',
  location: 'asd',
  number: '254',
  telephone: '243',
};
// const someUser = {
//   username: 'user12',
//   password: 'hanna121212!S',
//   tasks: [],
//   userDetails: {
//     id: '67ca1021-e654-4168-892e-4ad6761a3ae8',
//     location: 'Romania',
//     number: 155,
//     telephone: 1955649,
//     address: 'alba Iulia',
//   },
//   firstName: '',
//   lastName: '',
//   id: '',
//   email: '',
//   isDeactivated: true,
//   role: UserRole.USER,
//   profileImage: '',
// };

const mockUser = {
  id: 'fae03917-c7fc-4e94-9623-49ff56c9634b',
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    id: '67ca1021-e654-4168-892e-4ad6761a3ae8',
    location: 'Romania',
    number: 155,
    telephone: 1955649,
    address: 'alba Iulia',
    user: null,
  },
  firstName: 'ibra',
  lastName: 'qum',
  email: 'ibrahi@hot.com',
  isDeactivated: false,
  role: UserRole.USER,
  profileImage:
    'WhatsAppImage2021-10-21at13.39.10c3267776-fe9d-4067-9f98-8c785c532819.jpeg',
};
const mockTask = {
  id: '5f8b7365-50b9-48cf-a6dc-e58a9f54e2e2',
  title: 'eat food232aawwa425',
  description: 'lots of cleaning has to be done34sdd234234',
  status: TaskStatus.OPEN,
  taskMetadata: {
    id: 'f0f13157-0921-4bd1-977c-c8a3602eb354',
    details: 'hello there213',
    isDeactivated: true,
  },
  user: mockUser,
};

const mockUserDetailsRepository = () => ({
  getUserDetails: jest.fn(),
  createUserDetailsForUser: jest.fn(),
  save: jest.fn(),
});

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUserRole: jest.fn(),
  getRolesForUser: jest.fn(),
  updateOne: jest.fn(),
  getProfileImage: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository;
  let userDetailsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserDetailsRepository,
          useFactory: mockUserDetailsRepository,
        },
        UserDetails,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
    userDetailsRepository = module.get(UserDetailsRepository);
  });

  describe('updateUserRole', () => {
    it('calls UsersRepository.updateUserRole and returns the result', async () => {
      usersRepository.updateUserRole.mockResolvedValue('someValue');
      const result = await usersService.updateUserRole(
        'someId',
        UserRole.ADMIN,
      );
      expect(result).toBe('someValue');
    });
  });

  describe('getProfileImage', () => {
    it('calls UsersRepository.getProfileImage and returns the result', async () => {
      usersRepository.getProfileImage.mockResolvedValue('someValue');
      const result = await usersService.getProfileImage(
        mockUser,
        UserRole.ADMIN,
      );
      expect(result).toBe('someValue');
    });
  });

  describe('uploadFile', () => {
    it('calls UsersRepository.getUser and returns the result', async () => {
      usersRepository.updateOne.mockResolvedValue('someValue');
      const result = await usersService.uploadFile(
        'someId',
        './uploads/profileImages/',
      );
      expect(result).toBe('someValue');
    });
  });

  //   describe('updateUser', () => {
  //     it('calls UsersSErvice.updateUser and returns the result', async () => {
  //       usersRepository.save.mockResolvedValue(mockUser);
  //       userDetailsRepository.save.mockResolvedValue(mockUser.userDetails);
  //       const result = await usersService.updateUser(mockUser, dto);
  //       expect(result).toBe('someValue');
  //     });
  //   });

  describe('updateUserRole', () => {
    it('calls UsersRepository.updateUserRole and returns the result', async () => {
      usersRepository.updateUserRole.mockResolvedValue('someValue');
      const result = await usersService.updateUserRole(
        'someId',
        UserRole.ADMIN,
      );
      expect(result).toBe('someValue');
    });
  });

  describe('getRolesForUser', () => {
    it('calls UsersRepository.getRolesForUser and returns the result', async () => {
      usersRepository.getRolesForUser.mockResolvedValue('someValue');
      const result = await usersService.getRolesForUser();
      expect(result).toBe('someValue');
    });
  });
});
