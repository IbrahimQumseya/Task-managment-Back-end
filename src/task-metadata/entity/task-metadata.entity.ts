/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/task.entity';

@Entity()
export class TaskMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  details: string;

  @Column('boolean', { default: true })
  isDeactivated: boolean;

  @OneToOne(() => Task, (task) => task.taskMetadata)
  @JoinColumn()
  @Exclude()
  task: Task;
}
