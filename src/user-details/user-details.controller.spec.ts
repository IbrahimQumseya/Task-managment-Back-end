/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserDetailsController } from './user-details.controller';
import { UserDetailsRepository } from './user-details.repository';
import { UserDetailsService } from './user-details.service';

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
const ApiUserDetailsService = {
  provide: UserDetailsService,
  useFactory: () => ({
    getUserDetails: jest.fn(),
    createUserDetailsForUser: jest.fn(),
  }),
};
const ApiUserDetailsRepository = {
  provide: UserDetailsRepository,
  useFactory: () => ({
    getUserDetails: jest.fn(),
    createUserDetailsForUser: jest.fn(),
  }),
};
describe('User-details Controller', () => {
  let userDetailsService: UserDetailsService;
  let userDetailsController: UserDetailsController;
  let userDetailsRepository: UserDetailsRepository;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserDetailsController],
      providers: [
        UserDetailsService,
        ApiUserDetailsService,
        ApiUserDetailsRepository,
      ],
    }).compile();
    userDetailsController = await app.get(UserDetailsController);
    userDetailsService = await app.get(UserDetailsService);
    userDetailsRepository = await app.get(UserDetailsRepository);
  });
  describe('UserDetails Controller', () => {
    it('calls UserDetailsService.getTasks and returns the result', async () => {
      await userDetailsController.getUserDetails(mockUser);
      expect(userDetailsService.getUserDetails).toHaveBeenCalled();
    });
    it('calls UserDetailsService.createUserDetailsForUser and returns the result', async () => {
      await userDetailsController.createUserDetailsForUser('someId', {
        address: 'someAdress',
        location: 'someLoc',
        number: 'someNub',
        telephone: 231231,
      });
      expect(userDetailsService.createUserDetailsForUser).toHaveBeenCalled();
    });
  });
});
