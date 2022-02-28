import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({
    type: UserRole,
    description: 'Role of the user',
    enum: UserRole,
  })
  role: UserRole;
}
