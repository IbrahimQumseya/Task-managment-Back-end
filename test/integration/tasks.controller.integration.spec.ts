/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Task } from 'src/tasks/task.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { Connection } from 'typeorm';

describe('TasksController', () => {
  let connection: Connection;
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TasksModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    connection = moduleRef.get(Connection);
    await connection.synchronize(true);
  });
  afterAll(async () => {
    await Promise.all([app.close()]);
  });
  describe('getTasks', async () => {
    let jwtToken: string;
    it('testing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'user12', password: 'hanna121212!S' })
        .expect(200);
      jwtToken = response.body.accessToken;
      expect(jwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });
  });
});
