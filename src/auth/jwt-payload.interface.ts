/* eslint-disable prettier/prettier */
import { UserRole } from './enum/user-role.enum';

export interface JwtPayload {
  username: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isDeactivated: boolean;
    role: UserRole;
    profileImage: string;
    id: string;
  };
}
