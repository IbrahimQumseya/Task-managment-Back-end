import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TaskMetadataModule } from './task-metadata/task-metadata.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { UsersModule } from './users/users.module';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';
import { TaskMetadata } from './task-metadata/entity/task-metadata.entity';
import { UserDetails } from './user-details/entity/user-details.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          ssl: isProduction,
          logging: true,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          url: configService.get('POSTGRES_URL'),
          // entities: [Task, User, TaskMetadata, UserDetails],
          entities: ['src/**/*.entity.js', 'src/**/**/*.entity.js'],
          migrations: ['src/migrations/*.ts'],
          subscribers: ['src/subscriber/**/*.ts'],
          migrationsTableName: 'custom_migration_table',
          cli: {
            migrationsDir: 'src/migrations',
            entitiesDir: 'src/entity',
            subscribersDir: 'src/subscriber',
          },
          synchronize: true,
        };
      },
    }),
    AuthModule,
    TaskMetadataModule,
    UserDetailsModule,
    UsersModule,
  ],
})
export class AppModule {}
