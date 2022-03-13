/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../auth/users.respository';
import { TaskStatus } from '../tasks/task-status.enum';
import { UserDetailsRepository } from './user-details.repository';
import { UserDetailsService } from './user-details.service';

const mockUser = {
  username: 'user12',
  password: 'hanna121212!S',
  tasks: [],
  userDetails: {
    location: 'asd',
    number: 'asd',
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
const mockUserDetailsRepository = () => ({
  getUserDetails: jest.fn(),
  createUserDetailsForUser: jest.fn(),
});
describe('UserDetailsService', () => {
  let userDetailsService: UserDetailsService;
  let userDetailsRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserDetailsService,
        {
          provide: UserDetailsRepository,
          useFactory: mockUserDetailsRepository,
        },
        UsersRepository,
      ],
    }).compile();
    userDetailsService = await module.get(UserDetailsService);
    userDetailsRepository = await module.get(UserDetailsRepository);
  });
  describe('UserDetailsService', () => {
    it('calls UserDetailsService.getUserDetails and returns the result', async () => {
      userDetailsRepository.getUserDetails.mockResolvedValue(mockUser.userDetails);
      const result = await userDetailsService.getUserDetails(mockUser);
      expect(result).toBe(mockUser.userDetails);
    });
    it('calls UserDetailsService.createUserDetailsForUser and returns the result', async () => {
      userDetailsRepository.createUserDetailsForUser.mockResolvedValue(
        mockUser.userDetails,
      );
      const result = await userDetailsService.createUserDetailsForUser(
        'someId',
        {
          address: 'someAdress',
          location: 'someLoc',
          number: 'someNumb',
          telephone: 12156,
        },
      );
      expect(result).toBe(mockUser.userDetails);
    });
  });
});
