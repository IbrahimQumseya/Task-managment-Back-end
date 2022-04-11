import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';
import { Task } from './src/tasks/task.entity';
import { TaskMetadata } from './src/task-metadata/entity/task-metadata.entity';
import { User } from './src/auth/user.entity';
import { UserDetails } from './src/user-details/entity/user-details.entity';

dotenv.config();

const pgConfig: PostgresConnectionOptions = {
  ssl: false,
  type: 'postgres',

  // ---- NOT WORKING
  // host: process.env.TYPEORM_HOST,
  // port: +parseInt(process.env.TYPEORM_PORT),
  // username: `${process.env.TYPEORM_USERNAME}`,
  // password: process.env.TYPEORM_PASSWORD,
  // password: `${process.env.TYPEORM_PASSWORD}`,
  // database: `${process.env.TYPEORM_DATABASE}`,
  // url: `${process.env.POSTGRES_URL}`,

  // ----------working

  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  // password: `${process.env.DB_PASSWORD}`,
  database: `task-management`,
  url: `postgres://postgres:password@localhost:5432/task-management`,

  entities: [Task, TaskMetadata, User, UserDetails],
  // entities: ['src/**/*.entity.js', 'src/**/**/*.entity.js'],
  migrations: ['./migrations/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'custom_migration_table',
  cli: {
    migrationsDir: './migrations',
    entitiesDir: 'src/entity',
    subscribersDir: 'src/subscriber',
  },
  synchronize: false,
};

export = pgConfig;
