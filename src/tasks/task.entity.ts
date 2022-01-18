/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskMetadata } from '../task-metadata/entity/task-metadata.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  // @Exclude({ toPlainOnly: true })
  user: User;

  @OneToOne(() => TaskMetadata, taskmetaData => taskmetaData.task)
  taskMetadata: TaskMetadata;
}
