/* eslint-disable prettier/prettier */
import { User } from '../../auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @Column()
  number: string;

  @Column()
  telephone: number;

  @Column('text')
  address: string;

  @OneToOne(() => User, (user) => user.userDetails)
  @JoinColumn()
  user: User;
}
