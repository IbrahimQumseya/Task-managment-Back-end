/* eslint-disable prettier/prettier */
import { Task } from '../tasks/task.entity';
import { UserDetails } from '../user-details/entity/user-details.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from './enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  // delete nullable:true
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isDeactivated: boolean;

  @Column({nullable:true})
  resetPasswordToken: string;

  @Column({ default: UserRole.USER, enum: UserRole, type: 'enum' })
  role: UserRole;
  
  @Column({ nullable: true })
  profileImage: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];


  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  userDetails: UserDetails;
}
